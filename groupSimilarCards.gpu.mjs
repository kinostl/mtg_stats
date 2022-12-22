import { GPU } from 'gpu.js'

const gpu = new GPU({ mode: 'dev' })
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
  const maxTextureHeight = Math.floor(
    Math.sqrt(Math.pow(maxTextureSize, 2) / width)
  )
  const height = Math.min(indexedSentences.length, maxTextureHeight)
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

  const get2DRowHashes = gpu.createKernel(
    function (rows) {
      const row = rows[this.thread.x]
      let hash = 0
      for (let i = 0; i < this.constants.strLen; i++) {
        //31 is an arbitrary prime number
        hash = (31 * hash + row[i]) % this.constants.arrLen
      }
      return hash
    },
    {
      constants: { strLen: width, arrLen: height * depth },
      output: [height * depth]
    }
  )

  const flatten3DArray = gpu.createKernel(
    function (arr) {
      //More readable, makes CPU mode happy.
      const row = Math.floor(this.thread.y / this.constants.arrLim)
      const col = this.thread.y % this.constants.arrLim
      return arr[row][col][this.thread.x]
    },
    {
      constants: { arrLim: height, strLen: width },
      output: [width, height * depth]
    }
  )

  const blankDuplicateHashes = gpu.createKernel(
    function (hashes) {
      const hashA = hashes[this.thread.x]
      for (let i = this.thread.x + 1; i < this.constants.arrLen - 1; i++) {
        const hashB = hashes[i]
        if (hashA === hashB) return 0
      }
      return hashA
    },
    {
      constants: { strLen: width, arrLen: height * depth },
      output: [height * depth]
    }
  )

  const blankDuplicateRows = gpu.createKernel(
    function (rows, hashes) {
      const hash = hashes[this.thread.y]
      if (hash === 0) return 0
      const row = rows[this.thread.y][this.thread.x]
      return row
    },
    {
      constants: { strLen: width, arrLen: height * depth },
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
    const flatTemplates = flatten3DArray(templates)
    const rowHashes = get2DRowHashes(flatTemplates)
    const blankedHashes = blankDuplicateHashes(rowHashes)
    const blankedRows = blankDuplicateRows(flatTemplates, blankedHashes)
    return blankedRows
    //const filteredTemplates = zeroOutDuplicates(flatTemplates)
    //return filteredTemplates
  }

  const getFilteredTemplates =
    gpu.Kernel?.mode === 'gpu'
      ? gpu.combineKernels(
          buildTemplates,
          flatten3DArray,
          get2DRowHashes,
          blankDuplicateHashes,
          blankDuplicateRows,
          filterTemplatesFunction
        )
      : filterTemplatesFunction

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

  const deIndexedSentences = filteredTemplates.map(sentence =>
    [...sentence]
      .map(word => listOfWords[word])
      .filter(o => o)
      .join(' ')
  )
  console.log(deIndexedSentences)

  return deIndexedSentences
}
