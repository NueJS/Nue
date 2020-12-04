import { is_placeholder, unwrap } from '../str.js'

/**
 * returns an object of arrays which shows name, value and isVar property of an attribute
 * @param {Element} node - node for which attributes are to be returned
 * @returns {Object} - { id: ['cool', false], ':count': ['$.count', true]}
 */

function get_attributes (node) {
  const attributes = {}
  for (let i = 0; i < node.attributes.length; i++) {
    const attribute = node.attributes[i]
    let value = attribute.value
    const isVariable = is_placeholder(value)
    if (isVariable) value = unwrap(value)
    attributes[attribute.name] = [value, isVariable]
  }

  return attributes
}

export default get_attributes

/**
 * return attribute value of an element
 * return null if the value is null and  optional
 * throw error if value is null and not optional
 */
// export function attr (element, attributeName, optional) {
//   const str = element.getAttribute(attributeName)
//   if (!str) {
//     if (optional) return null
//     else throw new Error(`missing "${attributeName}" attribute on <${element.nodeName}> in <${this.compName}>`)
//   }

//   return unwrap(str)
// }
