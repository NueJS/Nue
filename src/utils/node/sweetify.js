// copy .sweet properties from node's tree to cloneNode's tree
// cloneNode is clone of node but it does not have custom .sweet properties added in node's tree
// sweetify is used to add those properties back in the cloneNode
const sweetify = (node, cloneNode) => {
  if (node.sweet) cloneNode.sweet = node.sweet
  if (node.hasChildNodes()) {
    node.childNodes.forEach((n, i) => {
      sweetify(n, cloneNode.childNodes[i])
    })
  }
}

export default sweetify
