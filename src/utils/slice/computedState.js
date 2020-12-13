import { mutate } from '../reactivity/mutate.js'
import addDep from './addDep.js'
import detectStateUsage from './detectStateUsage.js'

// when initializing the state, if a function is given
// call that function, detect the state keys it depends on, get the initial value
// update its value whenever its deps changes

function computedState (fn, k) {
  const [initValue, deps] = detectStateUsage(fn)
  let prevValue = initValue

  const onDepUpdate = () => {
    const value = fn()
    // only mutate if the value is actually changed
    if (prevValue !== value) {
      mutate(this.$, [k], value, 'set')
      prevValue = value
    }
  }

  // when any of its deps changes, update its value
  // depend on the root key only

  const paths = deps.map(d => d[0].split('.'))
  paths.forEach(path => addDep.call(this, path, onDepUpdate, 'computed'))

  return initValue
}

export default computedState
