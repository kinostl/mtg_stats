import cliProgress from 'cli-progress'
import fs from 'node:fs/promises'
import similar from './groupCards.mjs'

const groupedBar = new cliProgress.SingleBar(
  {
    format:
      'Grouping Finished | {bar} {percentage}% | ETA: {eta}s | Duration: {duration} | {value}/{total}'
  },
  cliProgress.Presets.shades_grey
)

const matchCache = new Map()

const getGroup = (word, list) =>
  list.reduce((arr, test) => {
    if (matchCache.has([word, test])) {
      console.log(`Cached value found for [${word}]\n`)
      arr.push(matchCache.get([word, test]))
      matchCache.delete([word, test])
    } else {
      if (similar(word, test)) {
        matchCache.set([test, word], word)
        arr.push(test)
      }
    }
    return arr
  }, [])

const getFilePromises = list =>
  list.reduce((arr, test, i) => {
    const group = JSON.stringify(getGroup(test, list), null, 4)
    groupedBar.increment()
    if (group.length >= 5) {
      arr.push(fs.writeFile(`./groupOutputs/${i}.json`, group))
    }
    return arr
  }, [])

function groupSimilarCards (list) {
  const barSize = list.length
  groupedBar.start(barSize, 0)
  const filePromises = getFilePromises(list)
  groupedBar.stop()
  console.log('Cards grouped!')
  return filePromises
}

export default groupSimilarCards
