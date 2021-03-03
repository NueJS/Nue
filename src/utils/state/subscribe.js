import { batchify } from '../batch'
import { origin } from '../closure.js'
import { SUBSCRIPTIONS } from '../constants'
import DEV from '../dev/DEV.js'
import errors from '../dev/errors.js'

// subscribe to slice of state pointed by the path in baseNue
// when that slice is updated, call the callback in "batchName" batch
const subscribe = (baseCompNode, path, cb, batchName) => {
  // get the originCompNode where the state referred by path is coming from
  const originCompNode = origin(baseCompNode, path)

  if (originCompNode !== baseCompNode && cb.node) {
    baseCompNode.nodesUsingClosure.add(cb.node)
  }

  // throw if no origin is found
  if (DEV && !originCompNode) throw errors.STATE_NOT_FOUND(baseCompNode.name, path.join('.'))

  // get the higher order cb that will only call the cb once every batch
  const batchCb = batchify(cb, originCompNode[batchName])

  // start from the root of subscriptions
  let target = originCompNode[SUBSCRIPTIONS]

  // add batchCb in path table at appropriate location
  // map is used to unsubscribe in constant time
  const lastIndex = path.length - 1
  path.forEach((key, i) => {
    if (!target[key]) target[key] = { $: new Set() }
    target = target[key]
    if (i === lastIndex) target.$.add(batchCb)
  })

  // return unsubscribe function to remove subscription
  return () => target.$.delete(batchCb)
}

// returns an array of removeDep functions
export const subscribeMultiple = (compNode, paths, cb, batchName) => {
  const unsubscribeFunctions = paths.map(path => subscribe(compNode, path, cb, batchName))
  // return unsubscribeMultiple
  return () => unsubscribeFunctions.forEach(c => c())
}

export default subscribe
