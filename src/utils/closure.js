import { hasSlice } from './state/slice'
import { TARGET } from './constants'

// get the origin component where the value of the state is coming from
// @todo replace with a custom mode in reactify?
export const origin = (nue, path) => {
  let targetNue = nue
  while (!hasSlice(targetNue.$[TARGET], path)) {
    if (!targetNue.closure) return undefined
    targetNue = targetNue.closure
  }
  return targetNue
}
