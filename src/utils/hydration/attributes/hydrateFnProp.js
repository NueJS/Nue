/**
 * add Fn on compo
 * @param {Comp} target
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */
export const hydrateFnProp = (target, attribute, comp) => {
  const propName = attribute._name
  const sourceFnName = /** @type {string}*/(attribute._placeholder)
  // if (!target.fn) target.fn = Object.create(comp.fn)
  target.fn[propName] = comp.fn[sourceFnName]
}
