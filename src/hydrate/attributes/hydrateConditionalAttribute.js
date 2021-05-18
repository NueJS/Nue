import { setAttr, removeAttr } from '../../dom/attributes'
import { syncNode } from '../../subscription/node/syncNode'

/**
 * add or remove attribute based on given condition
 * @param {Parsed_HTMLElement} element
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */

export const hydrateConditionalAttribute = (element, attribute, comp) => {
  const placeholder = /** @type {Placeholder} */(attribute._placeholder)
  const name = attribute._name

  const update = () => placeholder._getValue(comp)
    ? setAttr(comp, name, '')
    : removeAttr(element, name)

  syncNode(element, placeholder._statePaths, update, comp)
}
