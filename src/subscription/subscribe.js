
import { ITSELF } from '../constants'
import { errors } from '../dev/errors/index.js'
import { getOrigin } from '../state/getOrigin'
import { batchify } from '../batch/batchify'

/**
 * subscribe to slice of state pointed by the statePath in baseNue
 * when that slice is updated, call the callback in "batch" batch
 *
 * @param {Comp} baseComp
 * @param {StatePath} statePath
 * @param {SubCallBack | Function} updateCb
 * @param {0 | 1} batch
 * @returns {Function}
 */

export const subscribe = (baseComp, statePath, updateCb, batch) => {
  // get the originComp where the state referred by statePath is coming from
  const originComp = getOrigin(baseComp, statePath)

  // throw if no origin is found
  if (_DEV_ && !originComp) {
    throw errors.invalid_state_placeholder(baseComp._compName, statePath.join('.'))
  }

  if (/** @type {SubCallBack}*/(updateCb)._node && originComp !== baseComp) {
    baseComp._nodesUsingClosureState.add(/** @type {SubCallBack}*/(updateCb)._node)
  }

  // get the higher order updateCb that will only call the updateCb once every batch
  const batchCb = batchify(updateCb, originComp._batches[batch])

  // start from the root of subscriptions
  let target = originComp._subscriptions

  // add batchCb in statePath table at appropriate location
  // map is used to unsubscribe in constant time
  const lastIndex = statePath.length - 1
  statePath.forEach((key, i) => {
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
 * @param {StatePath[]} statePaths
 * @param {SubCallBack | Function} updateCb
 * @param {0 | 1} batch
 * @returns {Function}
 */

export const subscribeMultiple = (comp, statePaths, updateCb, batch) => {
  const unsubscribeFunctions = statePaths.map(
    statePath => subscribe(comp, statePath, updateCb, batch)
  )
  // return unsubscribeMultiple
  return () => unsubscribeFunctions.forEach(c => c())
}
