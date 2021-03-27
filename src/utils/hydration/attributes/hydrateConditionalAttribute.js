import { removeAttr, setAttr } from '../../node/dom.js'
import { syncNode } from '../../subscription/node.js'

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

  syncNode(comp, element, placeholder._stateDeps, update)
}
