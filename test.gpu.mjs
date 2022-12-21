import { GPU, input, Input } from 'gpu.js'
//import sentences from './zip_codes.mjs'

const gpu = new GPU({ mode: 'dev' })

const sentences = [
  'goodnight and hello moon and world',
  'goodnight moon and world',
  'goodnight moon',
  'goodnight world',
  'hello and goodnight moon',
  'hello and goodnight world and moon',
  'hello and goodnight world',
  'hello moon and world',
  'hello world and moon',
  'hello moon',
  'hello world'
]
const sentenceWords = sentences.map(sentence => sentence.split(' '))

const wordCounts = sentenceWords.map(sentence => sentence.length)
const longestSentenceWords = wordCounts.reduce(
  (longest, length) => (length > longest ? length : longest),
  0
)

const listOfWords = [
  '_',
  ...new Set(
    sentences
      .join()
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

console.log(indexedSentences)

// x = sentence
// y = word
// if y < 0, keep
//if x does not share a word count, keep
//if x shares a word count and y shares an index, keep
//if x shares a word count and y does not share an index, toss

/**
 * 3 1 2
 * 2 1 3
 * 3 2 1
 * 3 2 3
 * 3 2 1 1 2 2
 * 1 3 2 3 2 1
 */
const buildTemplates = gpu.createKernel(
  function (sentences, wordCounts) {
    const letter = sentences[this.thread.y][this.thread.x]
    const compLetter = sentences[this.thread.z][this.thread.x]
    const wordCount = wordCounts[this.thread.y]
    const compWordCount = wordCounts[this.thread.z]

    if (wordCount != compWordCount) return letter
    if (letter === compLetter) return letter
    return 0
    /**
     * Score Method
     *
     * Step 0. If all # return word
     * Step 1. Get X Points.
     *  - If not all #, X++
     * Step 2. If X Points Equal, Get Y Points
     *  - Y++ if in Y
     * Step 3. Calculate Y Score
     * - Y / StrLen
     * Step 4. Return Letter or _ based on Score
     * - if Score > 0.9 return word
     * - return 95 // _
     */
    /*
    flood fill method.
    const letter = sentences[this.thread.y][this.thread.x]
    if (letter === 32) return 32
    if (this.thread.y === this.thread.z) return letter
    const compLetter = sentences[this.thread.z][this.thread.x]

    if (this.thread.x + 1 < this.constants.strLen && this.thread.x - 1 > 0) {
      const nextLetter = sentences[this.thread.y][this.thread.x + 1]
      const nextCompLetter = sentences[this.thread.z][this.thread.x + 1]
      const prevLetter = sentences[this.thread.y][this.thread.x - 1]
      const prevCompLetter = sentences[this.thread.z][this.thread.x - 1]

      if (
        (prevLetter === 35 && nextLetter === 35) ||
        (prevLetter === 32 && nextLetter === 35) ||
        (prevLetter === 35 && nextLetter === 32)
      )
        return 95

      if (
        letter === compLetter &&
        nextLetter === nextCompLetter &&
        prevLetter === prevCompLetter
      )
        return letter

      return 95
    }

    if (letter === compLetter) return letter

    //step 0, iterate downwards. O
    //step 1, only care about stuff with matching characters. If there aren't matching characters skip it. O
    //step 2, we found something with a matching character. See how far these matches happen to the right.
    // return all characters that are on every column in matching rows. otherwise return an underscore.
    // if left to right is all underscores attempt right to left?

    return 95
    */
  },
  {
    output: [
      indexedSentences[0].length,
      indexedSentences.length,
      indexedSentences.length
    ]
  }
)

const templates = buildTemplates(indexedSentences, wordCounts)
const filteredTemplates = [
  ...new Set(templates.flat().map(template => JSON.stringify([...template])))
]
  .map(template => JSON.parse(template))
  .filter(template => template.indexOf(0) > -1)
  .filter(template => Math.max(...template) > 0)
console.log(filteredTemplates)
const deIndexedSentences = filteredTemplates.map(sentence =>
  [...sentence]
    .map(word => listOfWords[word])
    .filter(o => o)
    .join(' ')
)
console.log(deIndexedSentences)
/*
const decodedSentences = templates.map(sentence =>
  String.fromCharCode(...sentence)
)

console.log(decodedSentences)
*/
/*
const decodedList = templates
  .map(template => template.map(sentence => String.fromCharCode(...sentence)))
  .flat()
const dedupedDecodedList = [...new Set(decodedList)]
  .map(sentence => sentence.replaceAll('#', '').trim())
  .filter(sentence => sentence.includes('_'))
  .filter(sentence => /[a-z]/.test(sentence))
console.log(dedupedDecodedList)
*/
/*
const paddedSentences = sentences.map(sentence =>
  sentence.padEnd(largestSentence, ' ')
)
const gpuReadySentenceLengths = gpuReadySentences.map(
  sentence => sentence.length
)

const gpuPositions = gpu.createKernel(
  function (sentence, sentences, sentenceLengths) {
    const realLength = sentenceLengths[this.thread.y]
    if (this.thread.x >= realLength) return -2
    const letter = sentence[this.thread.y][this.thread.x]

    if (letter === 32) {
      return -3
    }

    for (let i = 0; i < this.constants.sentenceLength; i++) {
      const compLetter = sentences[this.thread.z][i]
      if (letter === compLetter && i >= this.thread.x) {
        return i
      }
    }
    return -1
  },
  {
    output: [
      largestSentence,
      gpuReadySentences.length,
      gpuReadySentences.length
    ],
    constants: {
      sentenceLength: largestSentence
    }
  }
)

const gpuScores = gpu.createKernel(
  function (positions) {
    let points = 0
    for (let i = 0; i < this.constants.sentenceLength; i++) {
      const letter = positions[this.thread.y][this.thread.x][i]
      const nextLetter = positions[this.thread.y][this.thread.x][i + 1]
      const hasNextLetter =
        i + 1 < this.constants.sentenceLength && nextLetter !== -2
      if (
        (hasNextLetter && letter + 1 === nextLetter) ||
        (hasNextLetter && nextLetter > -1 && letter === -3) ||
        (!hasNextLetter && letter > -1) ||
        (i === 0 && letter > -1)
      ) {
        points++
      }
    }
    return points
  },
  {
    output: [gpuReadySentences.length, gpuReadySentences.length],

    constants: {
      sentenceLength: largestSentence
    }
  }
)

const gpuMatches = gpu.createKernel(
  function (points, sentenceLengths) {
    const score =
      points[this.thread.y][this.thread.x] / sentenceLengths[this.thread.y]
    if (score < 0.5) return 0
    return 1
  },
  {
    output: [gpuReadySentences.length, gpuReadySentences.length],
    constants: {
      sentenceLength: largestSentence
    }
  }
)

const gpuGroups = gpu.createKernel(
  function (matches) {
    const match = matches[this.thread.y][this.thread.x]
    if (match > 0) return this.thread.x
    return -1
  },
  {
    output: [gpuReadySentences.length, gpuReadySentences.length]
  }
)

/**
[
  [ 'hello moon' ], Not long enough, skip
  [ 'hello world' ], Not long enough, skip
  [ 
    'goodnight  moon', 
    'goodnight world',
    'goodnight cog  ',
 ], 
 [
    'hello  moon', 
    'goodnight moon',
 ]
]

 */

/*
const gpuTemplates = gpu.createKernel(function (groups, sentences) {
  const letter = sentences[this.thread.x][this.thread.z]
  const anotherLetter = sentences[this.thread.y][this.thread.z]

  if (letter === anotherLetter) return letter
  return 95 // underscore character
})

const sortIntoGroups = gpu.combineKernels(
  gpuPositions,
  gpuScores,
  gpuMatches,
  gpuGroups,
  function (gpuReadySentences, sentenceLengths) {
    const positions = gpuPositions(
      gpuReadySentences,
      gpuReadySentences,
      sentenceLengths
    )
    const points = gpuScores(positions)
    const matches = gpuMatches(points, sentenceLengths)
    const groups = gpuGroups(matches)
    return groups
  }
)

const groups = sortIntoGroups(gpuReadySentences, sentenceLengths)

const decodedGroups = groups.map(group =>
  [...group].map(_sentence => sentences[_sentence]).filter(o => o)
)
console.log(decodedGroups)

/*
function theRealDeal () {
  if (matchList.length >= groupMin) {
    const template = sentence.reduce((parts, word) => {
      if (matchList.every(group => group.indexOf(word) > -1)) {
        parts.push(word)
      } else {
        parts.push('BLANK')
      }
      return parts
    }, [])
    const blankPoints = template.reduce((score, part) => {
      if (part.localeCompare('BLANK')) score++
      return score
    }, 0)
    const blankScore = blankPoints / sentence.length
    if (blankScore >= blankMin) {
      const templateString = template.join(' ').replaceAll('BLANK', '___')
      templates.push(templateString)
    }
  }
}
*/

/*
const matches = sentences.map((sentence, i) => {
  return points[i].map(point => {
    const score = point / sentence.length
    if (score < 0.5) return 0
    return 1
  })
})
*/

/*
const positions = sentences.map(sentence => {
  return sentences.map(_sentence => {
    const positions = []
    for (let i = 0; i < sentence.length; i++) {
      if (sentence[i] === 32) {
        positions[i] = -3
        continue
      }
      for (let j = 0; j < _sentence.length; j++) {
        if (_sentence[j] === sentence[i]) {
          if (positions[i - 1] && positions[i - 1] >= j) continue
          positions[i] = j
          break
        } else {
          positions[i] = -1
        }
      }
    }
    return positions
  })
})

const points = positions.map(_positions => {
  return _positions.map(__positions => {
    return __positions.reduce((_points, letter, i, arr) => {
      const nextLetter = arr[i + 1]
      if (
        (nextLetter && letter + 1 === nextLetter) ||
        (nextLetter && nextLetter > -1 && letter === -3) ||
        (!nextLetter && letter > -1) ||
        (i === 0 && letter > -1)
      ) {
        _points++
      }
      return _points
    }, 0)
  })
})

const matches = sentences.map((sentence, i) => {
  return points[i].map(point => {
    const score = point / sentence.length
    if (score < 0.5) return 0
    return 1
  })
})

const groups = matches.map(_matches => {
  return _matches.reduce((_group, _match, i) => {
    if (_match > 0) _group.push(sentences[i])
    return _group
  }, [])
})

const decodedGroups = groups.map(group => {
  return group.map(_sentence => {
    return String.fromCharCode(..._sentence)
  })
})

console.log(decodedGroups)

*/

/**
 * score <0.4 coincidentally gives this.
 * matches = [
 * [1,1,1,0], //hello moon
 * [1,1,0,1], //hello world
 * [1,0,1,1], //goodnight moon
 * [0,1,1,1]  //goodnight world
 * ]
 */

/**
 * actual matches = [
 * [1,1,1,0], //hello moon
 * [1,1,0,1], //hello world
 * [0,0,1,1], //goodnight moon
 * [0,0,1,1]  //goodnight world
 * ]
 * because goodnight moon and goodnight world are larger than
 * their hello counterparts, the hello counterparts score less
 * than 50% on their score.
 */

/**
 * actual groups
 * hello moon:      [hello moon, hello world, goodnight moon]
 * hello world:     [hello moon, hello world, goodnight world]
 * goodnight moon:  [goodnight moon, goodnight world]
 * goodnight world: [goodnight moon, goodnight world]
 */

/**
 * Expected Groups (Current focus)
 * [
 *     ['hello world', 'hello moon', 'goodnight world'],
 *     ['goodnight moon', 'hello moon', 'goodnight world'],
 * ]
 *
 * if 1 word in starting word matches the current sentence, add the sentence to the group
 * if all letters in a word match in the same order, its a matching word.
 *
 */

/*
 * Expected templates (collect all words that show up in everything)
 * [ '____ ____', '____ ____']
 *
 * Desired templates
 * [ 'hello ___', 'goodnight ___', '___ world', '___ moon']
 * Maybe check for showing up in >80% of the sentences in an object and make multiple templates based on that?
 *
 */

/*
const compareSentences = gpu.createKernel(
  function (letters) {
    const control = letters[this.thread.x][this.thread.y][this.thread.z]
    const test = letters[this.thread.x][this.thread.y][this.thread.z + 1]
    let equal = 0
    if (control === test) equal = 1
    return equal
  },
  {
    constants: { size: iterations },
    output: [sentences[0].length]
  }
)

const c = compareMatrix(sentences)
console.log(c)
*/
