import subscribe from '../state/subscribe'
import { hasSlice } from '../state/slice'

function addStateFromAttribute (parentComp, nue, attribute) {
  const { name, placeholder } = attribute
  const { getValue, deps } = placeholder

  const cb = () => {
    nue.$[name] = getValue(parentComp, nue.loopClosure)
  }

  nue.initState[name] = getValue(parentComp, nue.loopClosure)

  // if the attribute value depends on some part of state
  // when that part of state is changed update the attribute value
  deps.forEach(dep => {
    if (hasSlice(parentComp.$, dep)) {
      // cb is creating state using the parentComp and closure, so it should be done in computed queue
      subscribe(parentComp, dep, cb, 'computed')
    }
  })
  // return removeDeps
}

export default addStateFromAttribute
