import fs from 'node:fs/promises'
import cliProgress from 'cli-progress'

import { GPU } from 'gpu.js'

const gpu = new GPU()

const groupMin = 3
const matchMin = 0.6
const blankMin = 0.5
const destinationPath = './templates'

function groupSimilarCards (list, fileName) {
  const filteredList = [...new Set(list)]
  const encodedList = filteredList.map(sentence => {
    return sentence.split(' ').map(word => {
      return word.split('').map(letter => letter.charCodeAt(0))
    })
  })
  const decodedList = encodedList.map(sentence => {
    return sentence
      .map(word => {
        return String.fromCharCode(...word)
      })
      .join(' ')
  })

  console.log(encodedList)
  console.log(decodedList)

  /*
  const multiplyMatrixes = gpu
    .createKernel(function (a, b) {
      let sum = 0
      for (let i = 0; i < this.constants.width; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x]
      }
      return sum
    })
    .setOutput([width, height])
    .setConstants({
      width
    })
  // multiplyMatrixes(a, b);

  return fs.writeFile(
    `${destinationPath}/${fileName}.json`,
    JSON.stringify(dedupedTemplates, null, 2)
  )
  */
}

export default groupSimilarCards
