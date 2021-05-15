/**
 * add attribute on target element in context of comp
 * @param {Comp} target
 * @param {Attribute_ParseInfo} attribute
 */

export const hydrateStaticState = (target, attribute) => {
  target._prop$[attribute._name] = /** @type {string}*/(attribute._placeholder)
}
