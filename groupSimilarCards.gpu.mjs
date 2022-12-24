import { GPU } from 'gpu.js'
import debug from 'debug'

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
    Math.min(
      (indexedSentences.length * 2) / width,
      (maxTextureHeight * 2) / width
    ) / 2
  )

  console.log(indexedSentences.length, width, height, maxTextureHeight)
  console.log(width * height, width * height * height)

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

  const getCellDuplicates = gpu.createKernel(
    function (sentences) {
      const letter = sentences[this.thread.y][this.thread.x]
      const compLetter = sentences[this.thread.z][this.thread.x]
      if (letter === compLetter) return 1
      return 0
    },
    {
      output: [width, height, height]
    }
  )

  const reduceCellDuplicates = gpu.createKernel(
    function (sentences) {
      let total = 0
      for (let i = 0; i < this.constants.width; i++) {
        total += sentences[this.thread.y][this.thread.x][i]
      }
      return total
    },
    {
      constants: { width },
      output: [height, height]
    }
  )

  const reduceDuplicateRows = gpu.createKernel(
    function (sentences) {
      for (let i = this.thread.x + 1; i < this.constants.height; i++) {
        if (sentences[this.thread.x][i] === this.constants.width) return 1
      }
      return 0
    },
    {
      constants: { width, height },
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
    const cellDuplicates = getCellDuplicates(templates)
    const rowDuplicates = reduceCellDuplicates(cellDuplicates)
    const duplicates = reduceDuplicateRows(rowDuplicates)
    const blankedRows = blankDuplicateRows(templates, duplicates)
    return blankedRows
  }

  const getFilteredTemplates =
    gpu.Kernel?.mode === 'gpu'
      ? gpu.combineKernels(
          buildTemplates,
          getCellDuplicates,
          reduceCellDuplicates,
          reduceDuplicateRows,
          blankDuplicateRows,
          filterTemplatesFunction
        )
      : filterTemplatesFunction

  const appLog = debug('app')
  appLog('Start')
  const similarCards = new Set()
  for (let rowId = 0; rowId < indexedSentences.length; rowId++) {
    const rowLog = debug(`Row #${rowId}`)
    const row = indexedSentences[rowId]
    const rowCount = wordCounts[rowId]
    rowLog('Start')
    for (let chunk = 0; chunk < indexedSentences.length; chunk += height) {
      const log = debug(`Chunk [${chunk} ... ${chunk + height}]`)
      log('Get Filtered Templates')
      const templates = getFilteredTemplates(
        row,
        rowCount,
        indexedSentences.slice(chunk, chunk + height),
        wordCounts.slice(chunk, chunk + height)
      )
      log('Raw Templates %d', templates.length)
      const filteredTemplates = templates
        .filter(template => template.indexOf(1) > -1)
        .filter(template => Math.max(...template) > 1)
        .map(template =>
          template.filter((x, i, a) => {
            if (i + 1 < a.length && x === 1 && a[i + 1] === 1) {
              return false
            }
            return true
          })
        )

      log('Filtered Templates %d', filteredTemplates.length)
      const deIndexedSentences = filteredTemplates.map(sentence =>
        [...sentence]
          .map(word => listOfWords[word])
          .filter(o => o)
          .join(' ')
      )
      deIndexedSentences.forEach(sentence => similarCards.add(sentence))
      log('Added deindexed sentences %o', deIndexedSentences)
    }
    rowLog('Finish')
  }
  appLog('Finish')

  return similarCards
}
