import { subscribeMultiple } from '../subscription/subscribe.js'
import errors from '../dev/errors.js'
import DEV from '../dev/DEV.js'
import { AFTER_UPDATE_CBS, BEFORE_DOM_BATCH, BEFORE_UPDATE_CBS, ON_DESTROY_CBS, ON_MOUNT_CBS, CBS } from '../constants.js'

/**
 * @typedef {import('../types').compNode} compNode
 * @typedef {import('../types').batchInfoArray} batchInfoArray
 * */

/**
 *
 * @param {compNode} compNode
 * @param {number} name
 * @param {batchInfoArray} batchInfoArray
 * @returns
 */
// @ts-expect-error
export const runEvent = (compNode, name, batchInfoArray) => compNode[CBS][name].forEach(cb => cb(batchInfoArray))

/**
 *
 * @param {compNode} compNode
 */
const addLifecycles = (compNode) => {
  compNode[CBS] = {
    [ON_MOUNT_CBS]: [],
    [ON_DESTROY_CBS]: [],
    [BEFORE_UPDATE_CBS]: [],
    [AFTER_UPDATE_CBS]: []
  }

  /**
   * add the cb to given callbacks array
   * @param {number} name
   * @param {Function} cb
   * @returns {void}
   */
  // @ts-expect-error
  const addCb = (name, cb) => compNode[CBS][name].push(cb)

  compNode.events = {
    onMount: (cb) => addCb(ON_MOUNT_CBS, cb),
    onDestroy: (cb) => addCb(ON_DESTROY_CBS, cb),
    beforeUpdate: (cb) => addCb(BEFORE_UPDATE_CBS, cb),
    afterUpdate: (cb) => addCb(AFTER_UPDATE_CBS, cb),

    onMutate: (cb, ...slices) => {
      if (DEV && !slices.length) {
        throw errors.MISSING_DEPENDENCIES_IN_ON_MUTATE(compNode.name)
      }

      // addCb the state dependency after the component is mounted
      const subOnMount = () => {
        const deps = slices.map(slice => slice.split('.'))
        subscribeMultiple(compNode, deps, cb, BEFORE_DOM_BATCH)
      }

      addCb(ON_MOUNT_CBS, subOnMount)
    }
  }
}

export default addLifecycles
