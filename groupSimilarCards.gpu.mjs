import { GPU } from 'gpu.js'

const gpu = new GPU()
const maxTextureSize = gpu.Kernel?.features?.maxTextureSize || 256

export default function (rawSentences) {
  const sentences = rawSentences.map(sentence =>
    sentence
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .toLowerCase()
  )
  const debugSentences = sentences
  const sentenceWords = sentences.map(sentence => sentence.split(' '))

  const wordCounts = sentenceWords.map(sentence => sentence.length)
  const longestSentenceWords = Math.max(...wordCounts)
  const averageSentenceWords = Math.floor(
    (longestSentenceWords + Math.min(...wordCounts)) / 2
  )
  const blankFill = new Array(Math.min(10, averageSentenceWords))
    .fill('_')
    .join('')

  const listOfWords = [
    blankFill,
    ...new Set(
      sentences
        .join(' ')
        .split(' ')
        .sort((a, b) => a.length - b.length)
    )
  ]

  const indexMap = Object.fromEntries(listOfWords.map((word, i) => [word, i]))
  const indexedSentences = sentenceWords.map(sentence => {
    const indexedSentence = sentence.map(word => indexMap[word])
    const padCount = longestSentenceWords - sentence.length
    const padArr = new Array(padCount).fill(-1)
    return [...indexedSentence, ...padArr]
  })

  const width = longestSentenceWords
  //Need to divide by two so that the garbage collector has enough memory at the end.
  const height = Math.min(
    indexedSentences.length,
    Math.floor(Math.sqrt(Math.pow(maxTextureSize, 2) / width))
  )
  const depth = height

  const buildTemplates = gpu.createKernel(
    function (sentences, wordCounts) {
      const letter = sentences[this.thread.y][this.thread.x]
      const compLetter = sentences[this.thread.z][this.thread.x]
      const wordCount = wordCounts[this.thread.y]
      const compWordCount = wordCounts[this.thread.z]

      if (wordCount != compWordCount) return letter
      if (letter === compLetter) return letter
      return 0
    },
    {
      output: [width, height, depth]
    }
  )

  const flattenTemplates = gpu.createKernel(
    function (templates) {
      const row = Math.floor(this.thread.y / this.constants.arrLim)
      const col = this.thread.y % this.constants.arrLim
      return templates[row][col][this.thread.x]
    },
    {
      constants: { arrLim: height, strLen: width },
      output: [width, height * depth]
    }
  )

  const zeroOutDuplicates = gpu.createKernel(
    function (templates) {
      const sentence = templates[this.thread.y]
      for (
        let row = this.thread.y + 1;
        row < this.constants.arrLen - 1;
        row++
      ) {
        let score = 0
        const compSentence = templates[row]
        for (let col = 0; col < this.constants.strLen; col++) {
          const letter = sentence[col]
          const compLetter = compSentence[col]
          if (letter === compLetter) score++
        }
        if (score === this.constants.strLen) return 0
      }
      return templates[this.thread.y][this.thread.x]
    },
    {
      constants: { arrLen: height * depth, strLen: width },
      output: [width, height * depth]
    }
  )

  const filterTemplatesFunction = function (sentences, wordCounts) {
    debugger
    const templates = buildTemplates(sentences, wordCounts)
    const flatTemplates = flattenTemplates(templates)
    const filteredTemplates = zeroOutDuplicates(flatTemplates)
    return filteredTemplates
  }

  const getFilteredTemplates = gpu.combineKernels(
    buildTemplates,
    flattenTemplates,
    zeroOutDuplicates,
    filterTemplatesFunction
  )

  const templates = getFilteredTemplates(
    indexedSentences.slice(0, height),
    wordCounts.slice(0, depth)
  )
  console.log('raw templates completed')

  const filteredTemplates = templates
    .filter(template => template.indexOf(0) > -1)
    .filter(template => Math.max(...template) > 0)
    .map(template =>
      template.filter((x, i, a) => {
        if (i + 1 < a.length && x === 0 && a[i + 1] === 0) {
          return false
        }
        return true
      })
    )
  console.log('filtered templates completed')

  const deIndexedSentences = [
    ...new Set(
      filteredTemplates.map(sentence =>
        [...sentence]
          .map(word => listOfWords[word])
          .filter(o => o)
          .join(' ')
      )
    )
  ]
  console.log(deIndexedSentences)

  return deIndexedSentences
}
