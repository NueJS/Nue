import { batchify } from '../batch'
import { origin } from '../closure.js'
import { ITSELF, NODES_USING_CLOSURE, SUBSCRIPTIONS } from '../constants'
import DEV from '../dev/DEV.js'
import errors from '../dev/errors.js'

/**
 * subscribe to slice of state pointed by the path in baseNue
 * when that slice is updated, call the callback in "batchName" batch
 *
 * @param {import('../types').compNode} baseCompNode
 * @param {import('../types').path} path
 * @param {import('../types').subscribeCallback} cb
 * @param {string} batchName // @todo use enum instead
 * @returns {Function}
 */
const subscribe = (baseCompNode, path, cb, batchName) => {
  // get the originCompNode where the state referred by path is coming from
  const originCompNode = origin(baseCompNode, path)

  // throw if no origin is found
  if (DEV && !originCompNode) throw errors.STATE_NOT_FOUND(baseCompNode.name, path.join('.'))

  if (cb.node && originCompNode !== baseCompNode) {
    baseCompNode[NODES_USING_CLOSURE].add(cb.node)
  }

  // get the higher order cb that will only call the cb once every batch
  // @ts-ignore @todo use .batches
  const batchCb = batchify(cb, originCompNode[batchName])

  // start from the root of subscriptions
  let target = originCompNode[SUBSCRIPTIONS]

  // add batchCb in path table at appropriate location
  // map is used to unsubscribe in constant time
  const lastIndex = path.length - 1
  path.forEach((key, i) => {
    if (!target[key]) target[key] = { [ITSELF]: new Set() }
    target = target[key]
    if (i === lastIndex) target[ITSELF].add(batchCb)
  })

  // return unsubscribe function to remove subscription
  return () => target[ITSELF].delete(batchCb)
}

export default subscribe

/**
 * returns an array of removeDep functions
 *
 * @param {import('../types').compNode} compNode
 * @param {Array<import('../types').path>} paths
 * @param {import('../types').subscribeCallback} cb
 * @param {string} batchName
 * @returns {Function}
 */

export const subscribeMultiple = (compNode, paths, cb, batchName) => {
  const unsubscribeFunctions = paths.map(path => subscribe(compNode, path, cb, batchName))
  // return unsubscribeMultiple
  return () => unsubscribeFunctions.forEach(c => c())
}
