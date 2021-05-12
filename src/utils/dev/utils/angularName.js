import { lower } from '../../others'

/**
 * returns the component name surrounded by angular brackets eg. <compName>
 * @param {CompDef} compDef
 * @returns {string}
 */
export const angularCompName = compDef => `<${compDef._compName}>`

/**
 * returns the node name surrounded by angular brackets eg. <h1>
 * @param {Element} node
 * @returns {string}
 */
export const angularNodeName = (node) => `<${lower(node.nodeName)}>`
