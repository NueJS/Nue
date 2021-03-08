import { ITSELF } from '../constants'
import { isObject } from '../others'

// notify all the callbacks that are in given tree
const notifyAll = (tree) => {
  tree[ITSELF].forEach(cb => cb())
  for (const k in tree) notifyAll(tree[k])
}

// notify callbacks that are subscribed to given path that it is mutated
// navigate inside subscriptions using the path and notify entire subtree
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
