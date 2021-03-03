// copy .parsed properties from node's tree to cloneNode's tree
// cloneNode is clone of node but it does not have custom .parsed properties added in node's tree

import { PARSED } from '../constants'

// sweetify is used to add those properties back in the cloneNode
const copyParsed = (node, cloneNode) => {
  // @QUESTION ? is shallow clone enough ?
  if (node[PARSED]) cloneNode[PARSED] = { ...node[PARSED] }
  if (node.hasChildNodes()) {
    node.childNodes.forEach((n, i) => {
      copyParsed(n, cloneNode.childNodes[i])
    })
  }
}

export default copyParsed
