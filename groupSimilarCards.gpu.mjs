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
  const maxTextureHeight = maxTextureSize
  console.log(maxTextureHeight)
  const height = Math.min(indexedSentences.length * 2, maxTextureHeight)
  const depth = height

  // Chunking is going to want this. We feed it one word at a time and one chunk of the sentences at a time and we get something thats a lot easier for the async i/o to handle writing to file (or just storing it in memory after cleaning everything up.)
  // (Also it will let us increase our chunk size back up to a lot.)
  const buildTemplates = gpu.createKernel(
    function (sentence, wordCount, sentences, wordCounts) {
      const letter = sentence[this.thread.x]
      const compLetter = sentences[this.thread.y][this.thread.x]
      const compWordCount = wordCounts[this.thread.y]

      if (wordCount != compWordCount) return letter
      if (letter === compLetter) return letter
      return 0
    },
    {
      output: [width, height]
    }
  )

  const getRowHashes = gpu.createKernel(
    function (rows) {
      let hash = 0
      for (let i = 0; i < this.constants.strLen; i++) {
        const letter = rows[this.thread.x][i]
        //2 is an arbitrary prime number
        hash += letter * 2 * i
      }
      return hash
    },
    {
      constants: { strLen: width, arrLen: height },
      output: [height]
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
      constants: { strLen: width, arrLen: height },
      output: [height]
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
      constants: { strLen: width, arrLen: height },
      output: [width, height]
    }
  )

  const filterTemplatesFunction = function (
    sentence,
    wordCount,
    sentences,
    wordCounts
  ) {
    const templates = buildTemplates(sentence, wordCount, sentences, wordCounts)
    const rowHashes = getRowHashes(templates)
    const blankedHashes = blankDuplicateHashes(rowHashes)
    const blankedRows = blankDuplicateRows(templates, blankedHashes)
    return blankedRows
  }

  const getFilteredTemplates =
    gpu.Kernel?.mode === 'gpu'
      ? gpu.combineKernels(
          buildTemplates,
          getRowHashes,
          blankDuplicateHashes,
          blankDuplicateRows,
          filterTemplatesFunction
        )
      : filterTemplatesFunction

  const templates = getFilteredTemplates(
    indexedSentences[0],
    wordCounts[0],
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

  return deIndexedSentences
}
