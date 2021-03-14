import { subscribeMultiple } from '../subscription/subscribe'
import detectStateUsage from './detectStateUsage.js'
import { BEFORE_DOM_BATCH } from '../constants.js'

// when initializing the state, if a function is given
// call that function, detect the state keys it depends on, get the initial value
// update its value whenever its deps changes

/**
 *
 * @param {import('../types').compNode} compNode
 * @param {Function} fn
 * @param {string} prop
 * @returns
 */
const computedState = (compNode, fn, prop) => {
  const [initValue, paths] = detectStateUsage(fn)

  /** @type {import('../types').subscribeCallback} */
  const compute = () => {
    const value = fn()
    compNode.$[prop] = value
  }

  const deps = paths.map(path => path.length === 1 ? path : path.slice(0, -1))
  subscribeMultiple(compNode, deps, compute, BEFORE_DOM_BATCH)
  return initValue
}

export default computedState
