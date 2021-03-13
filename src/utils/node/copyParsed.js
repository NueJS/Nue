// copy .parsed properties from node's tree to cloneNode's tree
// cloneNode is clone of node but it does not have custom .parsed properties added in node's tree

import { PARSED } from '../constants'

/**
 * @param {Node} node
 * @param {Node} cloneNode
 */
const copyParsed = (node, cloneNode) => {
  if (PARSED in node) {
    // @todo if parsed is not messed with - no need to shallow clone
    // @ts-ignore
    cloneNode[PARSED] = { ...node[PARSED] }
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach((childNode, i) => {
      copyParsed(childNode, cloneNode.childNodes[i])
    })
  }
}

export default copyParsed
