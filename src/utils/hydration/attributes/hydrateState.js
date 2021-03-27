import { batches } from '../../../enums'
import { subscribeMultiple } from '../../subscription/subscribe'

/**
 * add state on target
 * @param {Comp} target
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */

export const hydrateState = (target, attribute, comp) => {
  const { _placeholder, _name } = attribute
  const { _getValue, _stateDeps } = /** @type {Placeholder}*/(_placeholder)

  // @TODO: shorten this
  const update = () => {
    if (target === comp) {
      target.$[_name] = _getValue(comp)
    } else {
      if (!target._prop$) target._prop$ = {}
      target._prop$[_name] = _getValue(comp)
    }
  }

  update()
  subscribeMultiple(comp, _stateDeps, update, batches._beforeDOM)
}
