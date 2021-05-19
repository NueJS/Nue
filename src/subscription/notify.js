import { ITSELF } from '../constants'

/**
 * invoke callbacks that are subscribed to given path
 * @param {Subscriptions} subscriptions
 * @param {StatePath} path
 */
export const notify = (subscriptions, path) => {
  let tree = subscriptions

  for (let i = 0; i < path.length - 1; i++) {
    // no subscription exists for the given edge, return
    if (!tree) break

    // @ts-expect-error
    tree[ITSELF].forEach(cb => cb())

    tree = tree[path[i]]
  }

  // for the last path's tree, notify entire subtree
  if (tree) notifySubTree(tree)

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
