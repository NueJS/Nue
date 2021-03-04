// copy .parsed properties from node's tree to cloneNode's tree
// cloneNode is clone of node but it does not have custom .parsed properties added in node's tree

import { PARSED } from '../constants'

// sweetify is used to add those properties back in the cloneNode
const copyParsed = (node, cloneNode) => {
  // @todo if parsed is not messed with - no need to shallow clone
  if (node[PARSED]) cloneNode[PARSED] = { ...node[PARSED] }
  if (node.hasChildNodes()) {
    node.childNodes.forEach((n, i) => {
      copyParsed(n, cloneNode.childNodes[i])
    })
  }
}

export default copyParsed
