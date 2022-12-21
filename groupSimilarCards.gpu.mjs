import { GPU } from 'gpu.js'

const gpu = new GPU()
const maxTextureSize = gpu.Kernel.features.maxTextureSize

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
  const height = Math.floor(maxTextureSize / longestSentenceWords)
  console.log(maxTextureSize)
  console.log(width, height, width * height)

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
      output: [width, height, height]
    }
  )

  const templates = buildTemplates(
    indexedSentences.slice(0, height),
    wordCounts.slice(0, height)
  )
  const filteredTemplates = [...templates]
    .flat()
    .map(template => [...template])
    .map(template =>
      template.filter((x, i, a) => {
        if (i + 1 < a.length && x === 0 && a[i + 1] === 0) {
          return false
        }
        return true
      })
    )
    .filter(template => template.indexOf(0) > -1)
    .filter(template => Math.max(...template) > 0)

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

  return deIndexedSentences
}
