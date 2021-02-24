import subscribe from '../state/subscribe'
import { hasSlice } from '../state/slice'

function addStateFromAttribute (parentNue, nue, attribute) {
  const { name, placeholder } = attribute
  const { getValue, deps } = placeholder

  const cb = () => {
    nue.$[name] = getValue(parentNue, nue.loopClosure)
  }

  nue.initState[name] = getValue(parentNue, nue.loopClosure)

  // if the attribute value depends on some part of state
  // when that part of state is changed update the attribute value
  deps.forEach(dep => {
    if (hasSlice(parentNue.$, dep)) {
      // cb is creating state using the parentNue and closure, so it should be done in computed queue
      subscribe(parentNue, dep, cb, 'computed')
    }
  })
  // return removeDeps
}

export default addStateFromAttribute
