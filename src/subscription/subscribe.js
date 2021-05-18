import { ITSELF } from '../constants'
import { errors } from '../dev/errors/index.js'
import { getOrigin } from '../state/getOrigin'
import { batchify } from '../batch/batchify'
import { createSubTree } from './createSubTree'

/**
 * subscribe to state of baseComp pointed by statePath
 * when that state is updated, onUpdate is called and is put into given batch
 *
 * @param {StatePath} statePath
 * @param {Comp} baseComp
 * @param {Function} onUpdate
 * @param {0 | 1} batch
 * @param {ParsedDOMNode} [targetNode]
 */

export const subscribe = (statePath, baseComp, onUpdate, batch, targetNode) => {
  // get the originComp where the state is coming from
  const originComp = getOrigin(baseComp, statePath)

  // if no origin is found
  if (_DEV_ && !originComp) {
    throw errors.invalid_state_placeholder(baseComp._compName, statePath.join('.'))
  }

  // if the node is using non-local state
  if (targetNode && originComp !== baseComp) {
    baseComp._nodesUsingNonLocalState.add(targetNode)
  }

  // when addToBatch callback is called, it adds the onUpdate callback to batch so that it can be flushed
  const addToBatch = batchify(onUpdate, originComp._batches[batch])

  // add the addToBatch callback in subscriptions
  let tree = originComp._subscriptions

  const lastIndex = statePath.length - 1

  statePath.forEach((key, i) => {

    // create a new subtree if does not exist
    if (!tree[key]) {
      tree[key] = createSubTree()
    }

    // go to subtree of key
    tree = tree[key]

    // if this is the last subtree in traversal, add the callback there
    if (i === lastIndex) {
      // @ts-expect-error
      tree[ITSELF].add(addToBatch)
    }
  })

  // return unsubscribe function that removes the callback from subscriptions
  // @ts-expect-error
  return () => tree[ITSELF].delete(addToBatch)
}
