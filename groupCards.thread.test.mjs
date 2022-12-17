import similarity from 'sentence-similarity'
import { commonScore } from 'similarity-score'
import { workerData, parentPort } from 'worker_threads'

function similar (sentence1, sentence2) {
  const s1 = sentence1.split(' ')
  const s2 = sentence2.split(' ')

  const { score, order, size } = similarity(s1, s2, commonScore)
  return score * order * size >= 0.9
}

function filter ({ word, list }) {
  list.forEach(test => {
    if (similar(word, test)) {
      console.log(test)
      //parentPort.postMessage(test)
    }
  })
}

const list = [
  'dont laugh alone pass it',
  'dont make noise principle is rotating in the corridor',
  'dont stand in front of my back',
  'ill give you clap on your cheeks',
  'both of you stand together separately',
  'bring your parents and your mother and especially your father',
  'can i have some snow in my cold drink',
  'close the window airforce is coming',
  'give me a red pen of any colour',
  'i have two daughters and both are girls',
  'i talk, he talk, why you middle talk',
  'keep quiet the principal just passed away',
  'pick the paper and fall into the dustbin',
  'stand in a straight circle',
  'there is no wind in the football',
  'why haircut not cut',
  'why are you looking at the monkey outside the window when i m here',
  'you go and understand the tree',
  'you rotate the ground 4 times',
  'you talking bad habit'
]

list.forEach(word => {
  filter({ word, list })
})
//parentPort.exit()
