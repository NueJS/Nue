import { mutate } from '../reactivity/mutate.js'
import addDep from './addDep.js'
import detectStateUsage from './detectStateUsage.js'

// when initializing the state, if a function is given
// call that function, detect the state keys it depends on, get the initial value
// update its value whenever its deps changes

function computedState (fn, k) {
  const [initValue, paths] = detectStateUsage(fn)

  const compute = () => mutate(this.$, [k], fn(), 'set')

  // when root of path changes value, recompute
  paths.forEach(path => addDep.call(this, [path[0]], compute, 'computed'))

  return initValue
}

export default computedState
