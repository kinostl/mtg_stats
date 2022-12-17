import { exec } from 'child_process'
import util from 'node:util'
import fs from 'node:fs/promises'
import cliProgress from 'cli-progress'
import WorkerPool from './workerPool.mjs'
import os from 'node:os'

const multibar = new cliProgress.MultiBar()

const getKeys = (control, test) => {
  const control_string = JSON.stringify(control)
  const test_string = JSON.stringify(test)
  const control_test_key = `${control_string}_${test_string}`
  const test_control_key = `${test_string}_${control_string}`
  return [control_test_key, test_control_key]
}
async function loadFiles () {
  const cache = new Map()
  const files = await fs.readdir('./groupOutputs')
  const promises = files.map(async file => {
    const number = Number(file.split('.')[0])
    if (Number.isInteger(number)) {
      const groupRes = await fs.readFile(`./groupOutputs/${file}`)
      const group = JSON.parse(groupRes)
      group.forEach((control, x, arr) => {
        arr.forEach(test => {
          const [control_key, test_key] = getKeys(control, test)
          if (cache.has(test_key)) {
            cache.delete(test_key)
          } else {
            cache.set(control_key, test)
          }
        })
      })
      return number
    }
    return 0
  })
  const numbers = await Promise.all(promises)
  const largestNumber = Math.max(...numbers)
  return [largestNumber, cache.entries()]
}

async function groupSimilarCards (list) {
  const groupMin = 3

  console.log('loading cache...')
  const [count, matchCache] = await loadFiles()
  console.log('Resuming at', count)
  const slice = list.slice(count)
  console.log(slice.length, 'entries remaining.')

  const workerPoolSize = os.cpus().length / 2
  console.log('Initiating the thread pool with', workerPoolSize, 'threads.')
  const pool = new WorkerPool(workerPoolSize, matchCache, list, groupMin)

  const chunkBar = multibar.create(
    list.length,
    count,
    { cached: pool.matchCache.size },
    {
      stopOnComplete: true,
      format:
        'Chunks Completed | {bar} {percentage}% | ETA: {eta}s | Duration: {duration} | {value}/{total} | Cache Size: {cached}'
    }
  )

  let finished = 0
  const updateFinish = () => {
    finished++
    if (finished === slice.length) {
      exec('fdupes ./groupOutputs -d -N', () => {
        pool.close()
        multibar.stop()
        console.log('Files written to ./groupOutputs')
        console.log('Duplicates removed')
      })
    }
  }

  slice.forEach((word, i) => {
    pool.runTask(word, (err, { groupString, doWrite }) => {
      if (err) {
        multibar.log(`Error: ${err}\n`)
      }

      chunkBar.increment({
        cache: pool.matchCache.size
      })

      if (doWrite) {
        fs.writeFile(`./groupOutputs/${i}.json`, groupString).then(updateFinish)
      } else {
        updateFinish()
      }
    })
  })
}

export default groupSimilarCards
