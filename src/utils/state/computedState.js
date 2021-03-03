import { mutate } from '../reactivity/mutate.js'
import { subscribeMultiple } from './subscribe.js'
import detectStateUsage from './detectStateUsage.js'
import { BEFORE_DOM_BATCH } from '../constants.js'

// when initializing the state, if a function is given
// call that function, detect the state keys it depends on, get the initial value
// update its value whenever its deps changes

const computedState = (compNode, fn, prop) => {
  const [initValue, paths] = detectStateUsage(fn)

  const compute = () => {
    const value = fn()
    mutate(compNode.$, [prop], value)
  }

  const deps = paths.map(path => path.length === 1 ? path : path.slice(0, -1))
  subscribeMultiple(compNode, deps, compute, BEFORE_DOM_BATCH)
  return initValue
}

export default computedState
