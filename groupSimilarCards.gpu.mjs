import { GPU } from 'gpu.js'

const gpu = new GPU()
const maxTextureSize = gpu.Kernel?.features?.maxTextureSize || 16384

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
    '',
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
    const padArr = new Array(padCount).fill(0)
    return [...indexedSentence, ...padArr]
  })

  const width = longestSentenceWords
  const maxTextureHeight = maxTextureSize
  const height = Math.floor(
    Math.min(indexedSentences.length * 2, maxTextureHeight * 2) / 2
  )
  console.log(width, height, maxTextureHeight)

  // Chunking is going to want this. We feed it one word at a time and one chunk of the sentences at a time and we get something thats a lot easier for the async i/o to handle writing to file (or just storing it in memory after cleaning everything up.)
  // (Also it will let us increase our chunk size back up to a lot.)
  const buildTemplates = gpu.createKernel(
    function (sentence, wordCount, sentences, wordCounts) {
      const letter = sentence[this.thread.x]
      const compLetter = sentences[this.thread.y][this.thread.x]
      const compWordCount = wordCounts[this.thread.y]

      if (wordCount != compWordCount) return compLetter
      if (letter === compLetter) return compLetter
      return 1
    },
    {
      output: [width, height]
    }
  )

  const getRowHashes = gpu.createKernel(
    function (rows) {
      let hash = 0
      for (let i = 0; i < this.constants.width; i++) {
        hash = 31 * hash + rows[this.thread.x][i]
      }

      return hash
    },
    {
      constants: { width },
      output: [height]
    }
  )

  const getHashDuplicates = gpu.createKernel(
    function (hashes) {
      const hashA = hashes[this.thread.x]
      const hashB = hashes[this.thread.y]
      if (this.thread.x < this.thread.y && hashA === hashB) return 1
      return 0
    },
    {
      output: [height, height]
    }
  )

  const reduceDuplicateHashes = gpu.createKernel(
    function (hashMaps) {
      let isDupe = 0
      for (let i = 0; i < this.constants.height; i++) {
        isDupe += hashMaps[this.thread.x][i]
      }
      return isDupe
    },
    {
      constants: { height },
      output: [height]
    }
  )

  const blankDuplicateRows = gpu.createKernel(
    function (rows, hashIsDuplicate) {
      const isDuplicate = hashIsDuplicate[this.thread.y] > 0
      if (isDuplicate) return 0
      return rows[this.thread.y][this.thread.x]
    },
    {
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
    const hashDuplicates = getHashDuplicates(rowHashes)
    const isDupes = reduceDuplicateHashes(hashDuplicates)
    const blankedRows = blankDuplicateRows(templates, isDupes)
    return blankedRows
  }

  const getFilteredTemplates =
    gpu.Kernel?.mode === 'gpu'
      ? gpu.combineKernels(
          buildTemplates,
          getRowHashes,
          getHashDuplicates,
          reduceDuplicateHashes,
          blankDuplicateRows,
          filterTemplatesFunction
        )
      : filterTemplatesFunction

  const templates = getFilteredTemplates(
    indexedSentences[0],
    wordCounts[0],
    indexedSentences.slice(0, height),
    wordCounts.slice(0, height)
  )
  console.log('raw templates completed', templates.length, templates)

  const filteredTemplates = templates
    .filter(template => template.indexOf(1) > -1)
    .filter(template => Math.max(...template) > 1)
  /*
    .map(template =>
      template.filter((x, i, a) => {
        if (i + 1 < a.length && x === 0 && a[i + 1] === 0) {
          return false
        }
        return true
      })
    )
    */
  console.log('filtered templates completed', filteredTemplates.length)

  const deIndexedSentences = filteredTemplates.map(sentence =>
    [...sentence]
      .map(word => listOfWords[word])
      .filter(o => o)
      .join(' ')
  )

  return deIndexedSentences
}
