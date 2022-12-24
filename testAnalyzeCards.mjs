//import groupSimilarCards from './groupSimilarCards.mjs'
import groupSimilarCards from './groupSimilarCards.gpu.mjs'

const sentences = [
  'goodnight and hello moon and world',
  'goodnight and hello world and moon',
  'goodnight and hello world and moon',
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

let hash = 0
const hashArr = [
  12, 182, 12, 1879, 13, 1880, 1469, 183, 544, 184, 185, 46, 2376, 990, 545,
  544, 546, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]
for (let i = 0; i < 117; i++) {
  hash = 31 * hash + hashArr[i]
}

console.log(hash)

console.log(groupSimilarCards(sentences))
