import copyParsed from './copyParsed'

/**
 * clone the node and add the parsed prop
 * @param {import('../types').parsedNode | Node} node
 * @returns {import('../types').parsedNode}
 */
const getClone = (node) => {
  const clone = node.cloneNode(true)
  copyParsed(node, clone)
  return /** @type {import('../types').parsedNode} */(clone)
}

export default getClone
