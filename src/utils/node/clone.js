import { copyParsed } from './copyParsed'

/**
 * clone the node and add the parsed prop
 * @param {import('types/dom').ParsedDOMElement | Node} node
 */
export const getParsedClone = (node) => {
  const clone = node.cloneNode(true)
  copyParsed(node, clone)
  return /** @type {import('types/dom').ParsedDOMElement} */(clone)
}
