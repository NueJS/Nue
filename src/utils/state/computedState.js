import { mutate } from '../reactivity/mutate.js'
import { addDeps } from './subscribe.js'
import detectStateUsage from './detectStateUsage.js'

// when initializing the state, if a function is given
// call that function, detect the state keys it depends on, get the initial value
// update its value whenever its deps changes

const computedState = (nue, fn, k) => {
  const [initValue, paths] = detectStateUsage(fn)

  const compute = () => {
    const value = fn()
    mutate(nue.$, [k], value)
  }

  // when root of path changes value, recompute
  const deps = paths.map(path => [path[0]])
  addDeps(nue, deps, compute, 'computed')
  return initValue
}

export default computedState
