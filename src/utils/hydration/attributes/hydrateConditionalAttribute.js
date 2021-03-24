import { removeAttr, setAttr } from '../../node/dom.js'
import { syncNode } from '../../subscription/node.js'

/**
 * add or remove attribute based on given condition
 * @param {import('types/dom').Parsed_HTMLElement} element
 * @param {import('types/parsed').Attribute_ParseInfo} attribute
 * @param {import('types/dom').Comp} comp
 */
export const hydrateConditionalAttribute = (element, attribute, comp) => {
  const placeholder = /** @type {import('types/placeholder').Placeholder} */(attribute._placeholder)
  const name = attribute._name

  const update = () => placeholder._getValue(comp)
    ? setAttr(comp, name, '')
    : removeAttr(element, name)

  syncNode(comp, element, placeholder._stateDeps, update)
}
