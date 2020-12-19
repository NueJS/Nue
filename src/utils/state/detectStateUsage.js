import modes from '../reactivity/modes.js'

// when detection mode is enabled is records all the keys that are accessed in state
// if state.a.b and state.c.d.e is accessed it becomes [['a', 'b'], ['c', 'd', 'e']]
export const accessed = {
  paths: []
}

// call the function and detect what keys it is using of this.$
// also get the return value and send it as well
const detectStateUsage = (fn) => {
  modes.detective = true
  const returnVal = fn()
  modes.detective = false
  const paths = [...accessed.paths] // copy
  accessed.paths = []
  return [returnVal, paths]
}

export default detectStateUsage
