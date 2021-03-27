import { setAttr } from '../../node/dom.js'
import { syncNode } from '../../subscription/node.js'

/**
 * add attribute on target element in context of comp
 * @param {Parsed_HTMLElement} target
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */

export const hydrateNormalAttribute = (target, attribute, comp) => {
  const placeholder = /** @type {Placeholder} */(attribute._placeholder)
  const update = () => setAttr(target, attribute._name, placeholder._getValue(comp))
  syncNode(comp, target, placeholder._stateDeps, update)
}
