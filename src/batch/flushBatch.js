import { nodeUpdated } from '../dev/nodeUpdated'

/**
 * run all callbacks of a batch with mutations info
 * ignore callbacks who are for updating a node and that node is not subscribed anymore to avoid extra dom updates
 * @param {Batch} batch
 * @param {Mutation[]} mutations
 */

export const flushBatch = (batch, mutations) => {

  batch.forEach(cb => {
    const { _node } = /** @type {SubCallBack}*/(cb)

    // if cb is for updating a node, only call cb if node is subscribed
    if ((_node && _node._isSubscribed) || !_node) {
      cb(mutations)
      if (_DEV_ && _node) nodeUpdated(_node)
    }
  })

  batch.clear()
}
