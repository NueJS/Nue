import { ITSELF } from '../../constants'
/**
 * notify all the callbacks that are in given subscriptions
 * @param {Subscriptions} subtree
 */
const notifySubTree = (subtree) => {
  // @ts-expect-error
  subtree[ITSELF].forEach(cb => cb())
  for (const k in subtree) notifySubTree(subtree[k])
}

/**
 * notify callbacks that are subscribed to given path that it is mutated
 * navigate inside subscriptions using the path and notify entire subtree
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
    if (edgeIndex === lastEdgeIndex) notifySubTree(tree)
  })
}
