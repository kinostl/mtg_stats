//import groupSimilarCards from './groupSimilarCards.mjs'
import groupSimilarCards from './groupSimilarCards.gpu.mjs'
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
            .replaceAll('+', ' plus ')
            .replaceAll('-', ' minus ')
            .replace(/\d/gi, 'n')
            .replaceAll('{n}', 'genericmana ')
            .replaceAll(/{(.*?)}/gi, 'specialmana ')
            .replace(/\b(white|blue|black|red|green)\b/gi, 'basecolor ')
            .replace(/\b(plain|island|swamp|mountain|forest)\b/gi, 'baseland ')
        )
      : ['']
  )
  .flat()
  .filter(card => card)

console.log('removing duplicates...')
const uniqueOracleTexts = [...new Set(oracleCardInfo)]
console.log('grouping similar texts...')
groupSimilarCards(uniqueOracleTexts)
//console.log(groupSimilarCards(uniqueOracleTexts))

/*
const sentences = [
  'goodnight and hello moon and world',
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

groupSimilarCards(sentences)
*/
