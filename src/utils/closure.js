import { hasSlice } from './state/slice'
import { TARGET } from './constants'

// get the origin component where the value of the state is coming from
// @todo replace with a custom mode in reactify?
export const origin = (compNode, path) => {
  // start with compNode
  let comp = compNode
  // if the path is not in compNode.$, go one level up
  while (!hasSlice(comp.$[TARGET], path)) {
    // if there is no parent comp, return undefined
    if (!comp.closure) return undefined
    comp = comp.closure
  }
  return comp
}
