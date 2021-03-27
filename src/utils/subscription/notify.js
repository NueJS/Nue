import { ITSELF } from '../../constants'
import { isObject } from '../others'

/**
 * notify all the callbacks that are in given subscriptions
 * @param {Subscriptions} subscriptions
 */
const notifyAll = (subscriptions) => {
  // @ts-expect-error
  subscriptions[ITSELF].forEach(cb => cb())
  for (const k in subscriptions) notifyAll(subscriptions[k])
}

/**
 * notify callbacks that are subscribed to given path that it is mutated
 * navigate inside subscriptions using the path and notify entire subtree
 * @param {Subscriptions} subscriptions
 * @param {StatePath} path
 */
export const notify = (subscriptions, path) => {
  let tree = subscriptions
  const leafIndex = path.length - 1
  path.forEach((edge, i) => {
    // if primitive, return
    if (!isObject(tree)) return
    // for non-leaf node, notify parent path subscribers
    if (i !== leafIndex) {
      // @ts-expect-error
      tree[ITSELF].forEach(cb => cb())
    }
    // notify child path subscribers
    notifyAll(tree)

    tree = tree[edge]
  })
}
