import { ORIGIN } from './constants'
import { targetProp } from './state/slice'

// get the origin component where the value of the state is coming from
// @todo replace with a custom mode in reactify?
export const origin = (compNode, path) => {
  if (path.length === 0) return compNode
  const [target] = targetProp(compNode.$, path)
  const originCompNode = target[ORIGIN]
  return originCompNode
}
