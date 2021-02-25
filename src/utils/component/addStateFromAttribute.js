import subscribe from '../state/subscribe'
import { hasSlice } from '../state/slice'

const addStateFromAttribute = (parentNue, nue, attribute) => {
  const { name, placeholder } = attribute
  const { getValue, deps } = placeholder

  const cb = () => {
    nue.$[name] = getValue(parentNue, nue.loopClosure)
  }

  nue.initState[name] = getValue(parentNue, nue.loopClosure)

  // if the attribute value depends on some part of state from parentNue
  // when that part of state is changed update the state of nue
  deps.forEach(dep => {
    if (hasSlice(parentNue.$, dep)) {
      const unsubscribe = subscribe(parentNue, dep, cb, 'computed')
      // when the nue is destroyed, unsubscribe from parentNue
      nue.events.onDestroy(unsubscribe)
    }
  })
}

export default addStateFromAttribute
