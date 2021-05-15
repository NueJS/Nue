import { IS_REACTIVE } from '../constants'
import { modes } from '../reactivity/modes'
import { getTargetProp } from './getTargetProp'

/**
 * get the origin component where the value of the state is coming from
 * @param {Comp} baseComp
 * @param {StatePath} statePath
 * @returns {Comp}
 */
export const getOrigin = (baseComp, statePath) => {
  if (statePath.length === 0) return baseComp

  let target, prop;
  [target, prop] = getTargetProp(baseComp.$, statePath)

  // @ts-ignore
  if (!target[IS_REACTIVE]) {
    [target, prop] = getTargetProp(baseComp.$, statePath.slice(0, -1))
  }

  modes._returnComp = true
  const originCompNode = target[prop]
  modes._returnComp = false

  return originCompNode
}
