import { batches } from '../enums'
import { subscribeMultiple } from '../subscription/subscribeMultiple'
import { detectStateUsage } from './detectStateUsage.js'

/**
 * create a computed state, stateName for comp component using the computeFn
 * @param {Function} computeFn
 * @param {string} stateName
 * @param {Comp} comp
 */
export const computedState = (computeFn, stateName, comp) => {
  const [initialComputedValue, usedStatePaths] = detectStateUsage(computeFn)

  const update = () => {
    comp.$[stateName] = computeFn()
  }

  // to avoid depending on a particular index of an array, depend on one level up
  // TODO: only slice if the path points to an array's item
  const statePaths = usedStatePaths.map(path => path.length === 1 ? path : path.slice(0, -1))

  subscribeMultiple(statePaths, comp, update, batches._beforeDOM)

  return initialComputedValue
}
