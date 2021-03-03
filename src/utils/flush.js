import { runBatch } from './batch'
import { runEvent } from './component/lifecycle.js'
import { AFTER_UPDATE_CBS, BATCH_INFO, BEFORE_DOM_BATCH, BEFORE_UPDATE_CBS, DOM_BATCH, IS_BATCHING } from './constants'

// wait for all the callbacks to be batched,
// then flush all events and batches in one go in proper order
const flush = (compNode) => {
  // don't trigger setTimeout again once the collecting is started
  compNode[IS_BATCHING] = true

  // after all the callbacks are triggered by state mutation, call callbacks in proper order
  setTimeout(() => {
    // do a shallow clone because compNode.batchInfo will be cleared out
    const batchInfo = [...compNode[BATCH_INFO]]
    runEvent(compNode, BEFORE_UPDATE_CBS, batchInfo)
    // run batch
    runBatch(compNode[BEFORE_DOM_BATCH], batchInfo)
    runBatch(compNode[DOM_BATCH], batchInfo)
    // clear batch
    runEvent(compNode, AFTER_UPDATE_CBS, batchInfo)
    // allow the batches to being built for next state mutation
    compNode[IS_BATCHING] = false
    compNode[BATCH_INFO].length = 0
  }, 0)
}

export default flush
