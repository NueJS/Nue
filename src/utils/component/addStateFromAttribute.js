import subscribe from '../state/subscribe'
import { hasSlice } from '../state/slice'
import { BEFORE_DOM_BATCH } from '../constants'

const addStateFromAttribute = (parentCompNode, compNode, attribute) => {
  const [{ getValue, deps }, name] = attribute
  const { loopClosure, events, init$ } = compNode
  const value = () => getValue(parentCompNode, loopClosure)

  const cb = () => { compNode.$[name] = value() }
  init$[name] = value()

  // if the attribute value depends on some part of state from parentCompNode
  // when that part of state is changed update the state of compNode
  deps.forEach(dep => {
    if (hasSlice(parentCompNode.$, dep)) {
      const unsubscribe = subscribe(parentCompNode, dep, cb, BEFORE_DOM_BATCH)
      events.onDestroy(unsubscribe)
    }
  })
}

export default addStateFromAttribute
