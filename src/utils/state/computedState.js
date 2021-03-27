import { batches } from 'enums'
import { subscribeMultiple } from '../subscription/subscribe'
import { detectStateUsage } from './detectStateUsage.js'

// when initializing the state, if a function is given
// call that function, detect the state keys it depends on, get the initial value
// update its value whenever its deps changes

/**
 *
 * @param {Comp} comp
 * @param {Function} fn
 * @param {string} prop
 * @returns
 */
export const computedState = (comp, fn, prop) => {
  const [initValue, paths] = detectStateUsage(fn)

  /** @type {SubCallBack} */
  const compute = () => {
    const value = fn()
    comp.$[prop] = value
  }

  const deps = paths.map(path => path.length === 1 ? path : path.slice(0, -1))
  subscribeMultiple(comp, deps, compute, batches._beforeDOM)
  return initValue
}
