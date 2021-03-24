/**
 * add Fn on compo
 * @param {import("types/dom").Comp} target
 * @param {import("types/dom").Comp} comp
 * @param {import("types/parsed").Attribute_ParseInfo} attribute
 */
const hydrateFnProp = (target, comp, attribute) => {
  const propName = attribute._name
  const sourceFnName = /** @type {string}*/(attribute._placeholder)
  target.fn[propName] = comp.parent.fn[sourceFnName]
}

export default hydrateFnProp
