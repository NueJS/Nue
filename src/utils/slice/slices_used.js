import modes from '../reactivity/modes.js'

// when detection mode is enabled is records all the keys that are accessed in state
// if state.a.b and state.c.d.e is accessed it becomes [['a', 'b'], ['c', 'd', 'e']]
export const accessed = {
  paths: []
}

// call the function and detect what keys it is using of this.$
const slices_used = (fn) => {
  modes.detect_slices = true
  const returnVal = fn()
  modes.detect_slices = false
  const deps = [...accessed.paths]
  accessed.paths = []
  return [returnVal, deps]
}

export default slices_used