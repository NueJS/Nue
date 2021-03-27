import { copyParsed } from './copyParsed'

/**
 * clone the node and add the parsed prop
 * @template {ParsedDOMElement | Node} T
 * @param {T} node
 * @returns {T}
 */
export const getParsedClone = (node) => {
  const clone = node.cloneNode(true)
  // @ts-expect-error
  copyParsed(node, clone)
  return /** @type {T} */(clone)
}
