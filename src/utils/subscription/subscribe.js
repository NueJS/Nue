import { batchify } from '../batch'
import { origin } from '../closure.js'
import { ITSELF } from '../../constants'
import { errors } from '../dev/errors.js'

/**
 * subscribe to slice of state pointed by the path in baseNue
 * when that slice is updated, call the callback in "batchName" batch
 *
 * @param {Comp} baseCompNode
 * @param {StatePath} path
 * @param {SubCallBack | Function} cb
 * @param {0 | 1} batchName // @todo use enum instead
 * @returns {Function}
 */
export const subscribe = (baseCompNode, path, cb, batchName) => {
  // get the originCompNode where the state referred by path is coming from
  const originCompNode = origin(baseCompNode, path)

  // throw if no origin is found
  if (_DEV_ && !originCompNode) {
    throw errors.STATE_NOT_FOUND(baseCompNode._compFnName, path.join('.'))
  }

  if (/** @type {SubCallBack}*/(cb)._node && originCompNode !== baseCompNode) {
    baseCompNode._nodesUsingClosureState.add(/** @type {SubCallBack}*/(cb)._node)
  }

  // get the higher order cb that will only call the cb once every batch

  const batchCb = batchify(cb, originCompNode._batches[batchName])

  // start from the root of subscriptions
  let target = originCompNode._subscriptions

  // add batchCb in path table at appropriate location
  // map is used to unsubscribe in constant time
  const lastIndex = path.length - 1
  path.forEach((key, i) => {
    if (!target[key]) target[key] = { [ITSELF]: new Set() }
    target = target[key]
    if (i === lastIndex) {
      // @ts-expect-error
      target[ITSELF].add(batchCb)
    }
  })

  // return unsubscribe function to remove subscription
  // @ts-expect-error
  return () => target[ITSELF].delete(batchCb)
}

/**
 * returns an array of removeDep functions
 *
 * @param {Comp} comp
 * @param {StatePath[]} paths
 * @param {SubCallBack | Function} cb
 * @param {0 | 1} batchName
 * @returns {Function}
 */

export const subscribeMultiple = (comp, paths, cb, batchName) => {
  const unsubscribeFunctions = paths.map(path => subscribe(comp, path, cb, batchName))
  // return unsubscribeMultiple
  return () => unsubscribeFunctions.forEach(c => c())
}
