import { lower } from '../../others'

/**
 * returns the component name surrounded by angular brackets eg. <compName>
 * @param {Comp} comp
 * @returns {string}
 */
export const angularCompName = comp => `<${comp._compFnName}>`

/**
 * returns the node name surrounded by angular brackets eg. <h1>
 * @param {Element} node
 * @returns {string}
 */
export const angularNodeName = (node) => `<${lower(node.nodeName)}>`
