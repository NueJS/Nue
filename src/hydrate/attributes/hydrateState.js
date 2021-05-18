import { batches } from '../../enums'
import { subscribeMultiple } from '../../subscription/subscribeMultiple'

/**
 * add state on target passed by its parent component
 * @param {Comp} comp
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} parentComp
 */

export const hydrateState = (comp, attribute, parentComp) => {
  const { _placeholder, _name } = attribute
  const { _getValue, _statePaths } = /** @type {Placeholder}*/(_placeholder)

  const update = () => {
    comp.$[_name] = _getValue(parentComp)
  }

  // TODO: instead of checking the _isLooped, check if the $ is created on it or not

  // if comp is looped, set the $ directly because it's $ is created already
  if (comp._isLooped) update()

  // else set the prop$
  else {
    if (!comp._prop$) comp._prop$ = {}
    comp._prop$[_name] = _getValue(parentComp)
  }

  subscribeMultiple(_statePaths, parentComp, update, batches._beforeDOM)
}
