import { flushBatch } from './batch'
import { runEvent } from './component/lifecycle.js'
import { AFTER_UPDATE_CBS, BATCH_INFO, BEFORE_DOM_BATCH, BEFORE_UPDATE_CBS, DOM_BATCH, FLUSH_SCHEDULED } from './constants'

/**
 * flush events and batched callbacks to outside world
 * @param {import('./types').compNode} compNode
 * @param {import('./types').batchInfoArray} batchInfoArray
 */
const flush = (compNode, batchInfoArray) => {
  // run before update event
  runEvent(compNode, BEFORE_UPDATE_CBS, batchInfoArray)

  // run and clear batches
  flushBatch(compNode[BEFORE_DOM_BATCH], batchInfoArray)
  flushBatch(compNode[DOM_BATCH], batchInfoArray)

  // run after update event
  runEvent(compNode, AFTER_UPDATE_CBS, batchInfoArray)
}

/**
 * schedule the flush
 * @param {import('./types').compNode} compNode
 */
export const scheduleFlush = (compNode) => {
  // schedule flush
  setTimeout(() => {
    // do a shallow clone because compNode.batchInfo will be cleared out
    const batchInfoArray = [...compNode[BATCH_INFO]]

    flush(compNode, batchInfoArray)
    // clear batch info
    compNode[BATCH_INFO].length = 0
    // reset flag
    compNode[FLUSH_SCHEDULED] = false
  }, 0)

  // start batching
  compNode[FLUSH_SCHEDULED] = true
}

export default flush
