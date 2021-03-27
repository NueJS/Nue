import { modes } from '../reactivity/modes.js'

// when detection mode is enabled is records all the keys that are accessed in state
// if state.a.b and state.c.d.e is accessed it becomes [['a', 'b'], ['c', 'd', 'e']]
/**
 * @type {{ _paths: StatePath[]}}
 */
export const accessed = {
  _paths: []
}

// call the function and detect what keys it is using of this.$
// also get the return value and send it as well
/**
 *
 * @param {Function} fn
 * @returns {[any, StatePath[]]}
 */
export const detectStateUsage = (fn) => {

  modes._detective = true
  const returnVal = fn()
  modes._detective = false

  const paths = [...accessed._paths] // shallow clone

  accessed._paths = []
  return [returnVal, paths]
}
