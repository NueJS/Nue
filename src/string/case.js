import { removeAttr, setAttr } from '../dom/attributes'

/**
 * return true if the character is uppercase
 * @param {string} str
 * @returns {boolean}
 */
export const isUpper = str => /[A-Z]/.test(str)

/**
 * return lowercase string
 * @param {string} str
 * @returns {string}
 */
export const lower = str => str.toLowerCase()

/**
 * convert string to upperCase
 * @param {string} str
 */
export const upper = str => str.toUpperCase()

const node = /*#__PURE__*/ document.createElement('div')

/**
 * convert dash case to camel case
 * @param {string} name
 * @returns {string}
 */
export const dashCaseToCamelCase = (name) => {
  const attributeName = 'data-' + name
  setAttr(node, attributeName, '')
  const camelCaseName = Object.keys(node.dataset)[0]
  removeAttr(node, attributeName)
  return camelCaseName
}
