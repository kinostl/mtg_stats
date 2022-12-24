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

console.log(groupSimilarCards(sentences))
