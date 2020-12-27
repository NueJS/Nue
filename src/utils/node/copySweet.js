// copy .sweet properties from node's tree to cloneNode's tree
// cloneNode is clone of node but it does not have custom .sweet properties added in node's tree
// sweetify is used to add those properties back in the cloneNode
const copySweet = (node, cloneNode) => {
  // do not give the ref directly, make a shallow clone
  // @TODO, use deepclone ??
  if (node.sweet) cloneNode.sweet = { ...node.sweet }
  if (node.hasChildNodes()) {
    node.childNodes.forEach((n, i) => {
      copySweet(n, cloneNode.childNodes[i])
    })
  }
}

export default copySweet
