import { syncNode } from '../subscription/node'

/**
 * process the text node
 * @param {import('../types').compNode} compNode
 * @param {import('../types').parsedNode} textNode
 * @param {*} parsed
 */
const processTextNode = (compNode, textNode, parsed) => {
  const { getValue, deps } = parsed.placeholder
  const update = () => {
    textNode.textContent = getValue(compNode)
  }
  syncNode(compNode, textNode, deps, update)
}

export default processTextNode
