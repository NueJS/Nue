import { runBatch } from '../callbacks.js'
import { runEvent } from '../component/lifecycle.js'

const clearQueue = (nue) => {
  for (const key in nue.queue) {
    nue.queue[key].clear()
  }
}
// wait for all the callbacks to be registered and then call all of them in proper order
const invokeQueue = (nue) => {
  // don't trigger setTimeout again once the collecting is started
  nue.batching = true

  // after all the callbacks are triggered by state mutation, call callbacks in proper order
  setTimeout(() => {
    runEvent(nue, 'beforeUpdate')
    runBatch(nue, 'computed')
    runBatch(nue, 'dom')
    clearQueue(nue)
    runEvent(nue, 'afterUpdate')
    // allow the queue to being built for next state mutation
    nue.batching = false
  }, 0)
}

export default invokeQueue
