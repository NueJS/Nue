import { batches } from '../../enums'
import { subscribeMultiple } from '../../subscription/subscribe'

/**
 * add state on target
 * @param {Comp} target
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */

export const hydrateState = (target, attribute, comp) => {
  const { _placeholder, _name } = attribute
  const { _getValue, _statePaths } = /** @type {Placeholder}*/(_placeholder)

  const update = () => {
    target.$[_name] = _getValue(comp)
  }

  // if target is looped component, set the $
  if (target._isLooped) update()

  // else set the prop$
  else {
    if (!target._prop$) target._prop$ = {}
    target._prop$[_name] = _getValue(comp)
  }

  subscribeMultiple(comp, _statePaths, update, batches._beforeDOM)
}
