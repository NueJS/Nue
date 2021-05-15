/**
 * add Fn on compo
 * @param {Comp} target
 * @param {Attribute_ParseInfo} attribute
 * @param {Comp} comp
 */
export const hydrateFnProp = (target, attribute, comp) => {

  // create target.fn if not already
  if (!target.fn) target.fn = Object.create(target.parent.fn)

  // add the function in target.fn
  target.fn[attribute._name] = comp.fn[/** @type {string}*/(attribute._placeholder)]

  // @Example
  // <comp fn.foo='bar'>
  // attribute._name === 'foo'
  // attribute._placeholder === 'bar'
}
