import { mutate } from '../reactivity/mutate.js'
import slices_used from './slices_used.js'

// when initializing the state, if a function is given
// call that function, detect the state keys it depends on, get the initial value
// update its value whenever its deps changes

function functional_slices (fn, k) {
  const [initValue, deps] = slices_used(fn)
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
  // depend on the root key ???
  this.on.reactiveUpdate(onDepUpdate, ...deps.map(d => d[0]))
  return initValue
}

export default functional_slices
