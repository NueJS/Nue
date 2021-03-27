import { IS_REACTIVE } from '../constants'
import { modes } from './reactivity/modes'
import { targetProp } from './state/slice'

/**
 * get the origin component where the value of the state is coming from
 * @param {Comp} baseComp
 * @param {StatePath} statePath
 * @returns {Comp}
 */
export const origin = (baseComp, statePath) => {
  if (statePath.length === 0) return baseComp

  let target, prop;
  [target, prop] = targetProp(baseComp.$, statePath)

  // @ts-ignore
  if (!target[IS_REACTIVE]) {
    [target, prop] = targetProp(baseComp.$, statePath.slice(0, -1))
  }

  modes._returnComp = true
  const originCompNode = target[prop]
  modes._returnComp = false

  return originCompNode
}
