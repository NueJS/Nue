import devtools from '../apis/devtools'
import { IS_SUBSCRIBED } from './constants'
import DEV from './dev/DEV'

/**
 * return function which when called adds the cb to given batch
 * @param {Function} cb
 * @param {Set<Function>} batch
 */
export const batchify = (cb, batch) => () => batch.add(cb)

// @todo reduce the amount of functions in this file - they all are very similar
/**
 *
 * @param {Set<Function>} batch
 * @param {import('./types').batchInfoArray} batchInfo
 */
export const flushBatch = (batch, batchInfo) => {
  batch.forEach(cb => {
    // @ts-ignore // @todo fix this
    const { node } = cb
    // if cb is for updating a node, only call cb if node is subscribed
    if ((node && node[IS_SUBSCRIBED]) || !node) {
      cb(batchInfo)
      if (DEV && node) devtools.onNodeUpdate(node)
    }
  })
  // once all callbacks are run clear the batch
  batch.clear()
}
