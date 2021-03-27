import { nodeUpdated } from './dev/nodeUpdated'

/**
 * return function which when called adds the cb to given batch
 * @param {SubCallBack} cb
 * @param {Batch} batch
 */
export const batchify = (cb, batch) => () => batch.add(cb)

// @todo reduce the amount of functions in this file - they all are very similar
/**
 *
 * @param {Batch} batch
 * @param {Mutation[]} mutations
 */
export const flushBatch = (batch, mutations) => {
  batch.forEach(cb => {
    // @ts-ignore // @todo fix this
    const { _node } = cb
    // if cb is for updating a node, only call cb if node is subscribed
    if ((_node && _node._isSubscribed) || !_node) {
      cb(mutations)
      if (_DEV_ && _node) {
        nodeUpdated(_node)
      }
    }
  })
  // once all callbacks are run clear the batch
  batch.clear()
}
