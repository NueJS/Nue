/**
 * add Fn on compo
 * @param {import("types/dom").Comp} target
 * @param {import("types/parsed").Attribute_ParseInfo} attribute
 * @param {import("types/dom").Comp} comp
 */
export const hydrateFnProp = (target, attribute, comp) => {
  const propName = attribute._name
  const sourceFnName = /** @type {string}*/(attribute._placeholder)
  target.fn[propName] = comp.parent.fn[sourceFnName]
}
