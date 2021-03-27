/**
 * add Fn on compo
 * @param {Comp} target
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */
export const hydrateFnProp = (target, attribute, comp) => {
  const propName = attribute._name
  const sourceFnName = /** @type {string}*/(attribute._placeholder)
  target.fn[propName] = comp.parent.fn[sourceFnName]
}
