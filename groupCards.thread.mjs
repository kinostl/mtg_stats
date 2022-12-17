import similarity from 'sentence-similarity'
import { commonScore } from 'similarity-score'
import { workerData, parentPort } from 'worker_threads'

const list = workerData.list

function similar (sentence1, sentence2) {
  const s1 = sentence1.split(' ')
  const s2 = sentence2.split(' ')

  const { score, order, size } = similarity(s1, s2, commonScore)
  return score * order * size >= 0.7
}

function filterCached (word, skipList) {
  return list.reduce((arr, test) => {
    if (skipList.indexOf(test) > -1) {
      const index = skipList.indexOf(test)
      arr.push(skipList[index])
    } else {
      if (similar(word, test)) {
        arr.push(test)
      }
    }
    return arr
  }, [])
}
function filter (word, skipList) {
  return list.reduce((arr, test) => {
    if (similar(word, test)) {
      arr.push(test)
    }
    return arr
  }, [])
}

parentPort.on('message', ({ word, groupMin, skipList }) => {
  const group =
    skipList.length > 0 ? filterCached(word, skipList) : filter(word)
  const doWrite = group.length >= groupMin
  const groupString = JSON.stringify(group, null, 4)
  parentPort.postMessage({ group, doWrite, groupString })
})
