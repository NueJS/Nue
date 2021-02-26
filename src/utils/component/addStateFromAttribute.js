import subscribe from '../state/subscribe'
import { hasSlice } from '../state/slice'
import { BEFORE_DOM_BATCH } from '../constants'

const addStateFromAttribute = (parentNue, nue, attribute) => {
  const [{ getValue, deps }, stateName] = attribute

  const cb = () => {
    nue.$[stateName] = getValue(parentNue, nue.loopClosure)
  }

  nue.initState[stateName] = getValue(parentNue, nue.loopClosure)

  // if the attribute value depends on some part of state from parentNue
  // when that part of state is changed update the state of nue
  deps.forEach(dep => {
    if (hasSlice(parentNue.$, dep)) {
      const unsubscribe = subscribe(parentNue, dep, cb, BEFORE_DOM_BATCH)
      // when the nue is destroyed, unsubscribe from parentNue
      nue.events.onDestroy(unsubscribe)
    }
  })
}

export default addStateFromAttribute
