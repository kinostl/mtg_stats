import { GPU } from 'gpu.js'
import sentences from './zip_codes.mjs'

const gpu = new GPU()

const sentenceLengths = sentences.map(sentence => sentence.length)
const largestSentence = Math.max(...sentenceLengths)
const paddedSentences = sentences.map(sentence =>
  sentence.padEnd(largestSentence, ' ')
)
const gpuReadySentences = paddedSentences.map(sentence =>
  [...sentence].map(letter => letter.charCodeAt(0))
)

const gpuPositions = gpu.createKernel(
  function (sentence, sentences) {
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

const positions = gpuPositions(gpuReadySentences, gpuReadySentences)

console.log(positions)

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
