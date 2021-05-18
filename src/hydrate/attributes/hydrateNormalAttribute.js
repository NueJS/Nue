import { setAttr } from '../../dom/attributes'
import { syncNode } from '../../subscription/node/syncNode'

/**
 * add attribute on element element in context of comp
 * @param {Parsed_HTMLElement} element
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */

export const hydrateNormalAttribute = (element, attribute, comp) => {

  const { _placeholder, _name } = attribute
  const { _getValue, _statePaths } = /** @type {Placeholder} */(_placeholder)

  const update = () => setAttr(element, _name, _getValue(comp))

  syncNode(element, _statePaths, update, comp)
}
