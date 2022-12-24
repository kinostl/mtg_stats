//import groupSimilarCards from './groupSimilarCards.mjs'
import groupSimilarCards from './groupSimilarCards.gpu.mjs'
import fs from 'node:fs'

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

const similarCards = groupSimilarCards(sentences)
fs.writeFileSync('./similarCards.json', JSON.stringify(similarCards, null, 4))
