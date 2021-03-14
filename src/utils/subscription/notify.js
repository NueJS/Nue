import { ITSELF } from '../constants'
import { isObject } from '../others'

/**
 * notify all the callbacks that are in given subscriptions
 * @param {import('../types').subscriptions} subscriptions
 */
const notifyAll = (subscriptions) => {
  subscriptions[ITSELF].forEach(cb => cb())
  for (const k in subscriptions) notifyAll(subscriptions[k])
}

/**
 * notify callbacks that are subscribed to given path that it is mutated
 * navigate inside subscriptions using the path and notify entire subtree
 * @param {import('../types').subscriptions} subscriptions
 * @param {import('../types').path} path
 */
const notify = (subscriptions, path) => {
  let tree = subscriptions
  const leafIndex = path.length - 1
  path.forEach((edge, i) => {
    // if primitive, return
    if (!isObject(tree)) return
    // for non-leaf node, notify parent path subscribers
    if (i !== leafIndex) tree[ITSELF].forEach(cb => cb())
    // notify child path subscribers
    notifyAll(tree)

    tree = tree[edge]
  })
}

export default notify
