import { AsyncResource } from 'node:async_hooks'
import { EventEmitter } from 'node:events'
import path from 'node:path'
import { Worker } from 'node:worker_threads'
import { createBrotliCompress } from 'node:zlib'

const kTaskInfo = Symbol('kTaskInfo')
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent')

const getKeys = (control, test) => {
  const control_string = JSON.stringify(control)
  const test_string = JSON.stringify(test)
  const control_test_key = `${control_string}_${test_string}`
  const test_control_key = `${test_string}_${control_string}`
  return [control_test_key, test_control_key]
}

class WorkerPoolTaskInfo extends AsyncResource {
  constructor (callback) {
    super('WorkerPoolTaskInfo')
    this.callback = callback
  }

  done (err, result) {
    this.runInAsyncScope(this.callback, null, err, result)
    this.emitDestroy() // `TaskInfo`s are used only once.
  }
}

export default class WorkerPool extends EventEmitter {
  constructor (numThreads, matchCache, list, groupMin) {
    super()
    this.numThreads = numThreads
    this.workers = []
    this.freeWorkers = []
    this.tasks = []
    this.matchCache = new Map(matchCache)
    this.list = list
    this.opts = {
      workerData: { list }
    }
    this.groupMin = groupMin
    console.log('Cache loaded', this.matchCache.size, 'items')

    for (let i = 0; i < numThreads; i++) this.addNewWorker(this.opts)

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift()
        this.runTask(task, callback)
      }
    })
  }

  addNewWorker (opts) {
    const worker = new Worker('./groupCards.thread.mjs', opts)
    worker.on('message', result => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result)
      worker[kTaskInfo] = null
      this.freeWorkers.push(worker)
      this.emit(kWorkerFreedEvent)
    })
    worker.on('error', err => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo]) worker[kTaskInfo].done(err, null)
      else this.emit('error', err)
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1)
      this.addNewWorker(opts)
    })
    this.workers.push(worker)
    this.freeWorkers.push(worker)
    this.emit(kWorkerFreedEvent)
  }

  runTask (task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback })
      return
    }

    const worker = this.freeWorkers.pop()

    const word = task
    const skipList = this.list.reduce((arr, test) => {
      const [control_key, test_key] = getKeys(word, test)
      if (this.matchCache.has(control_key)) {
        const cachedValue = this.matchCache.get(control_key)
        arr.push(cachedValue)
        this.matchCache.delete(control_key)
      }
      return arr
    }, [])

    const _cb = (err, res) => {
      res.group.forEach(test => {
        const [control_key, test_key] = getKeys(word, test)
        this.matchCache.set(test_key, word)
      })
      callback(err, res)
    }

    worker[kTaskInfo] = new WorkerPoolTaskInfo(_cb)
    worker.postMessage({
      word,
      skipList,
      groupMin: this.groupMin
    })
  }

  close () {
    for (const worker of this.workers) worker.terminate()
  }
}
