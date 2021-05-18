import { ITSELF } from '../constants'

/**
 * invoke callbacks that are subscribed to given path
 * @param {Subscriptions} subscriptions
 * @param {StatePath} path
 */
export const notify = (subscriptions, path) => {
  let tree = subscriptions
  const lastEdgeIndex = path.length - 1

  path.forEach((edge, edgeIndex) => {
    // @ts-expect-error
    tree[ITSELF].forEach(cb => cb())
    tree = tree[edge]
    // no subscription exists for the given edge, return
    if (!tree) return
    if (edgeIndex === lastEdgeIndex) notifySubTree(tree)
  })
}

/**
 * notify all the callbacks that are in given subscriptions
 * @param {Subscriptions} subtree
 */
const notifySubTree = (subtree) => {
  // @ts-expect-error
  subtree[ITSELF].forEach(cb => cb())
  for (const k in subtree) notifySubTree(subtree[k])
}
