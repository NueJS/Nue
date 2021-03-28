import { copyParsed } from './copyParsed'

/**
 * clone the node and add the parsed prop
 * @param {ParsedDOMElement} node
 * @returns {ParsedDOMElement}
 */
export const getParsedClone = (node) => {
  const clone = /** @type {ParsedDOMElement}*/(node.cloneNode(true))
  copyParsed(node, clone)
  return clone
}
