import { ORIGIN_MODE } from './constants'
import modes from './reactivity/modes'
import { targetProp } from './state/slice'

/**
 * get the origin component where the value of the state is coming from
 * @param {import('./types').compNode} compNode
 * @param {import('./types').path} path
 * @returns {import('./types').compNode}
 */
export const origin = (compNode, path) => {
  if (path.length === 0) return compNode
  modes[ORIGIN_MODE] = true
  const [target, prop] = targetProp(compNode.$, path)
  const originCompNode = target[prop]
  modes[ORIGIN_MODE] = false
  return originCompNode
}
