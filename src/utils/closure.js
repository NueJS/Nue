import { ORIGIN_MODE } from './constants'
import modes from './reactivity/modes'
import { targetProp } from './state/slice'

// get the origin component where the value of the state is coming from
// @todo replace with a custom mode in reactify?
export const origin = (compNode, path) => {
  if (path.length === 0) return compNode
  modes[ORIGIN_MODE] = true
  const [target, prop] = targetProp(compNode.$, path)
  const originCompNode = target[prop]
  modes[ORIGIN_MODE] = false
  return originCompNode
}
