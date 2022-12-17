import { Worker } from 'worker_threads'
import { exec } from 'child_process'
import util from 'node:util'
import fs from 'node:fs/promises'
import cliProgress from 'cli-progress'

const multibar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true
  },
  cliProgress.Presets.shades_grey
)

let threadsPool, listCopy, listTower

const matchCache = new Map()

const createThread = (cb, onErr, list) => {
  const worker = new Worker('./groupCards.thread.mjs', {
    workerData: { list }
  })

  worker.on('message', cb)
  worker.on('error', onErr)

  console.log('worker created')
  return worker
}

function utilizeThread (i) {
  console.log('worker utilitzed')
  const _word = listTower.shift()
  const word = _word[0]
  const iter = _word[1]
  if (word) {
    const skipList = listCopy.reduce((arr, test) => {
      if (matchCache.has([word, test])) {
        multibar.log('Cache matched\n')
        arr.messages.push(matchCache.get([word, test]))
        matchCache.delete([word, test])
      }
      return arr
    }, [])
    console.log(`worker handling iter #${iter}: ${word}`)
    threadsPool[i].postMessage({ word, iter, skipList })
  } else {
    threadsPool[i].close()
    threadsPool.splice(i, 1)
  }
}

async function groupSimilarCards (list) {
  const barSize = list.length
  const chunkBar = multibar.create(
    barSize,
    0,
    { word: 'none' },
    {
      stopOnComplete: true,
      format:
        'Chunks Completed | {bar} {percentage}% | ETA: {eta}s | Duration: {duration} | {value}/{total}'
    }
  )
  const fileBar = multibar.create(
    barSize,
    0,
    { word: 'none' },
    {
      stopOnComplete: true,
      format:
        'Files Written    | {bar} {percentage}% | ETA: {eta}s | Duration: {duration} | {value}/{total}'
    }
  )

  const CHUNKSIZE = 7
  const GROUPMIN = 10

  listTower = list.map((x, i) => [x, i])
  listCopy = [...list]
  const promisesPool = new Set()

  threadsPool = [...Array(CHUNKSIZE)].map((o, i) => {
    const thread = createThread(
      ({ word, group, iter }) => {
        console.log('worker finished')
        group.forEach(test => {
          matchCache.set([test, word], word)
        })

        if (output.length >= GROUPMIN) {
          const _output = JSON.stringify(output, null, 4)
          const promise = fs
            .writeFile(`./groupOutputs/${iter}.json`, _output)
            .then(() => {
              fileBar.increment({ word })
            })
            .then(() => {
              promisesPool.delete(promise)
            })

          promisesPool.add(promise)
        }

        if (iter % CHUNKSIZE === 0) {
          const dedupe = exec('fdupes ./groupOutputs -d -N').then(() => {
            promisesPool.delete(dedupe)
          })
          promisesPool.add(dedupe)
        }

        chunkBar.increment()
        utilizeThread(i)
      },
      ({ word, group, iter }) => {
        multibar.log(`Worker #${iter} failed with ${word}.`)
        chunkBar.increment()
        utilizeThread(i)
      },
      list
    )

    return thread
  })

  for (let i = 0; i < CHUNKSIZE; i++) {
    utilizeThread(i)
  }

  /*
  while (listCopy.length > 0 && threadsPool.length > 0) {
    //do nothing
  }
  */
  await Promise.allSettled(promisesPool)
  multibar.stop()
}

export default groupSimilarCards
