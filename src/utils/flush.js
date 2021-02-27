import { runBatch } from './batch'
import { runEvent } from './component/lifecycle.js'
import { BEFORE_DOM_BATCH, DOM_BATCH } from './constants'

// wait for all the callbacks to be batched,
// then flush all events and batches in one go in proper order
const flush = (nue) => {
  // don't trigger setTimeout again once the collecting is started
  nue.batching = true

  // after all the callbacks are triggered by state mutation, call callbacks in proper order
  setTimeout(() => {
    runEvent(nue, 'beforeUpdate')
    // run batch
    runBatch(nue.batches[BEFORE_DOM_BATCH])
    runBatch(nue.batches[DOM_BATCH])
    // clear batch
    runEvent(nue, 'afterUpdate')
    // allow the batches to being built for next state mutation
    nue.batching = false
  }, 0)
}

export default flush