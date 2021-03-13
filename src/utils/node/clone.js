import copyParsed from './copyParsed'

/**
 * clone the node and add the parsed prop
 * @param {Node} node
 * @returns {Node}
 */
const getClone = (node) => {
  const clone = node.cloneNode(true)
  copyParsed(node, clone)
  return clone
}

export default getClone
