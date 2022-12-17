//import { SimpleDataNode } from 'simple-data-analysis'
import { SimpleDataNode } from 'simple-data-analysis'
import * as Plot from '@observablehq/plot'
import groupSimilarSentences from './groupCards.mjs'
import fs from 'node:fs/promises'
import cliProgress from 'cli-progress'

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)

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
const oracleCardInfo = oracleCards
  .map(card =>
    card.type_line
      .toLowerCase()
      .split(' ')
      .reduce((ans, curr) => {
        if (ans) return ans
        return cardTypes.includes(curr)
      }, false) && card.oracle_text
      ? card.oracle_text
          .replaceAll(card.name, 'cardname')
          .replaceAll('+', 'plus ')
          .replaceAll('-', 'minus ')
          .replace(/\d/gi, 'n')
          .replaceAll('{n}', 'genericmana ')
          .replaceAll(/{(.*?)}/gi, 'specialmana ')
          .replace(/(white|blue|black|red|green)/gi, 'basecolor ')
          .replace(/[^a-z']/gi, ' ')
          .replace(/  +/g, ' ')
          .toLowerCase()
          .trim()
      : ''
  )
  .filter(card => card)
  .sort((a, b) => a.split(' ')[0].localeCompare(b.split(' ')[0]))

try {
  await fs.rm('./groupOutputs', { recursive: true, force: true })
} catch (err) {
  console.error(err)
}

await fs.mkdir('./groupOutputs')

const cardSlice = oracleCardInfo.slice(0, 10)
const barSize = cardSlice.length
bar1.start(barSize, 0)

await groupSimilarSentences(cardSlice, async (output, x) => {
  const _output = JSON.stringify(output, null, 4)
  await fs.writeFile(`./groupOutputs/${x}.json`, _output)
  bar1.increment()
})

bar1.update(barSize)
bar1.stop()
/*
const wordCounts = oracleCardInfo.reduce((totals, card) => {
  const words = card.oracle_text.split(' ')
  const type_lines = card.type_line.split('—')[0].split(' ')
  type_lines.forEach(type_line => {
    if (!totals[type_line]) totals[type_line] = { type_line }
    words.forEach(word => {
      if (!totals[type_line][word]) {
        totals[type_line][word] = 1
      } else {
        totals[type_line][word]++
      }
    })
  })
  return totals
}, {})

const filteredWordCounts = Object.entries(wordCounts)
  .map(([key, value]) => value)
  .map(entry => {
    const filteredWordsArr = Object.entries(entry).filter(
      ([word, count]) => word.length > 2 && count > 9
    )
    if (filteredWordsArr.length) {
      return filteredWordsArr.map(([word, count]) => ({
        type: entry.type_line,
        word,
        count
      }))
    }
    return []
  })
  .flat()

const types = ['Artifact', 'Creature', 'Enchantment', 'Instant', 'Sorcery']
//const types = [...new Set(filteredWordCounts.map(entry => entry.typej)]
const words = [...new Set(filteredWordCounts.map(entry => entry.word))]
const mySimpleData = await new SimpleDataNode({
  data: filteredWordCounts
})
  .filterValues({ key: 'type', valueComparator: type => types.includes(type) })
  .addKey({
    key: 'type_id',
    itemGenerator: entry => types.indexOf(entry.type)
  })
  .addKey({
    key: 'word_id',
    itemGenerator: entry => words.indexOf(entry.word)
  })

await mySimpleData.saveCustomChart({
  path: `./counts.html`,
  plotOptions: {
    height: 50000,
    y: { grid: true },
    facet: {
      data: mySimpleData.getData(),
      y: 'word'
    },
    marks: [
      Plot.frame(),
      Plot.barY(mySimpleData.getData(), { x: 'type', y: 'count', fill: 'type' })
    ]
  }
})
*/
/*
// What I want this to do is show the type on the x axis, the count of the current word as a bar on the y axis, height dictated by count of that word for that type.
// The count show how many **matches** there are between word and type. as in "There are 50 cards of type Artifact with the word Target. This means there are 50 cards with the word Target of the type Artifact."

  .saveCustomChart({
    path: `./counts.html`,
    plotOptions: {
      grid: true,
      marks: [
        Plot.rectY(
          filteredWordCounts,
          Plot.binX({ y: 'count' }, { fy: 'word', fill: 'word', x: 'type' })
        ),
        Plot.ruleY([0])
      ]
    }
  })
  */
/*
await Promise.all(
  types.map(type => {
    new SimpleDataNode({
      data: filteredWordCounts
    })
      .saveData({ path: `./counts/data/${type}.json` })
      .saveChart({
        path: `./counts/charts/${type}.html`,
        type: 'dot',
        x: 'count',
        y: 'word',
        color: 'word',
        marginLeft: 250
      })
  })
)
*/
/*
  .showTable()
const oracleTexts = await new SimpleDataNode()
  .excludeMissingValues()
  .removeDuplicates()
  .summarize({
    keyCategory: 'oracle_text',
    summary: 'count'
  })
  .filterValues({
    key: 'count',
    valueComparator: count => count > 1
  })
*/
