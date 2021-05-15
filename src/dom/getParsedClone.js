import { copyParsed } from './copyParsed'

/**
 * clone the node and add the parsed prop
 * @template {ParsedDOMElement} T
 * @param {T} node
 * @returns {T}
 */
export const getParsedClone = (node) => {
  const clone = /** @type {T}*/(node.cloneNode(true))
  copyParsed(node, clone)
  return clone
}
