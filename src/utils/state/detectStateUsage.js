import { DETECTIVE_MODE } from '../constants.js'
import modes from '../reactivity/modes.js'

// when detection mode is enabled is records all the keys that are accessed in state
// if state.a.b and state.c.d.e is accessed it becomes [['a', 'b'], ['c', 'd', 'e']]
/**
 * @type {{ paths: Array<import('../types').path>}}
 */
export const accessed = {
  paths: []
}

// call the function and detect what keys it is using of this.$
// also get the return value and send it as well
/**
 *
 * @param {Function} fn
 * @returns {[any, Array<import('../types').path>]}
 */
const detectStateUsage = (fn) => {
  modes[DETECTIVE_MODE] = true
  const returnVal = fn()
  modes[DETECTIVE_MODE] = false
  const paths = [...accessed.paths] // shallow clone
  accessed.paths = []
  return [returnVal, paths]
}

export default detectStateUsage
