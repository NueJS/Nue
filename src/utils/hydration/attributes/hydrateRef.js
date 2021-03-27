/**
 * add reference to element on comp.refs
 * @param {Parsed_HTMLElement} element
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */
export const hydrateRef = (element, attribute, comp) => {
  const refName = /** @type {string}*/(attribute._placeholder)
  comp.refs[refName] = element
}
