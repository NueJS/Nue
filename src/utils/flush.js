import { runBatch } from './batch'
import { runEvent } from './component/lifecycle.js'
import { AFTER_UPDATE_CBS, BATCH_INFO, BEFORE_DOM_BATCH, BEFORE_UPDATE_CBS, DOM_BATCH, FLUSH_SCHEDULED } from './constants'

// flush events and batched callbacks to outside world
const flush = (compNode, batchInfo) => {
  // run before update event
  runEvent(compNode, BEFORE_UPDATE_CBS, batchInfo)
  // run and clear batches
  runBatch(compNode[BEFORE_DOM_BATCH], batchInfo)
  runBatch(compNode[DOM_BATCH], batchInfo)
  // run after update event
  runEvent(compNode, AFTER_UPDATE_CBS, batchInfo)
}

export const scheduleFlush = (compNode) => {
  // schedule flush
  setTimeout(() => {
    // do a shallow clone because compNode.batchInfo will be cleared out
    const batchInfo = [...compNode[BATCH_INFO]]

    flush(compNode, batchInfo)
    // clear batch info
    compNode[BATCH_INFO].length = 0
    // reset flag
    compNode[FLUSH_SCHEDULED] = false
  }, 0)

  // start batching
  compNode[FLUSH_SCHEDULED] = true
}

export default flush
