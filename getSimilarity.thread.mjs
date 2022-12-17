import similarity from 'sentence-similarity'
import { commonScore } from 'similarity-score'
import { workerData, parentPort } from 'worker_threads'

function similar (sentence1, sentence2) {
  const s1 = sentence1.split(' ')
  const s2 = sentence2.split(' ')

  const { score, order, size } = similarity(s1, s2, commonScore)
  return score * order * size >= 0.7
}

function filter ({ control, test }) {
  if (similar(control, test)) {
    parentPort.postMessage(test)
  }
}

filter(workerData)
parentPort.close()
