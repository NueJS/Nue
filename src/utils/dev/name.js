import { lower } from '../others'

/**
 *
 * @param {Comp} comp
 * @returns {string}
 */
export const compName = comp => `<${comp._compFnName}>`

/**
 * return the "<x>" for xNode
 * @param {Element} node
 * @returns {string}
 */
export const nodeName = (node) => `<${lower(node.nodeName)}>`
