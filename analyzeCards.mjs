import { exec as _exec } from 'child_process'
import util from 'node:util'
import fs from 'node:fs/promises'
const exec = util.promisify(_exec)

//import groupSimilarCards from './groupSimilarCards.mjs'
import groupSimilarCards from './groupSimilarCards.new.mjs'
import oracleCards from './oracle-cards.js'

const cardTypes = [
  'land',
  'creature',
  'artifact',
  'enchantment',
  'planeswalker',
  'instant',
  'sorcery'
]

console.log('preparing oracle text...')
const oracleCardInfo = oracleCards
  .map(card =>
    card.type_line
      .toLowerCase()
      .split(' ')
      .reduce((ans, curr) => {
        if (ans) return ans
        return cardTypes.includes(curr)
      }, false) && card.oracle_text
      ? card.oracle_text.split('\n').map(o =>
          o
            .replaceAll(card.name, 'cardname')
            .replaceAll('+', 'plus ')
            .replaceAll('-', 'minus ')
            .replace(/\d/gi, 'n')
            .replaceAll('{n}', 'genericmana ')
            .replaceAll(/{(.*?)}/gi, 'specialmana ')
            .replace(/\b(white|blue|black|red|green)\b/gi, 'basecolor ')
            .replace(/\b(plain|island|swamp|mountain|forest)\b/gi, 'baseland ')
            .replace(/[^a-z']/gi, ' ')
            .replace(/  +/g, ' ')
            .toLowerCase()
            .trim()
        )
      : ['']
  )
  .flat()
  .filter(card => card)
  .sort((a, b) => a.split(' ')[0].localeCompare(b.split(' ')[0]))
// Sorts by first word.

console.log('removing duplicates...')
const uniqueOracleTexts = [...new Set(oracleCardInfo)]
const cardSlice = uniqueOracleTexts.slice()
console.log('grouping similar texts...')

/*
try {
  console.log('Cleaning files.')
  await fs.rm('./groupOutputs', { recursive: true, force: true })
  await fs.mkdir('./groupOutputs')
  console.log('Files cleaned.')
} catch (e) {
  console.log(err)
}
*/

await groupSimilarCards(cardSlice)
