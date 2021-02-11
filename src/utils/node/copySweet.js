// copy .parsed properties from node's tree to cloneNode's tree
// cloneNode is clone of node but it does not have custom .parsed properties added in node's tree
// sweetify is used to add those properties back in the cloneNode
const copySweet = (node, cloneNode) => {
  // do not give the ref directly, make a shallow clone
  // @TODO, use deepclone ??
  if (node.parsed) cloneNode.parsed = { ...node.parsed }
  if (node.hasChildNodes()) {
    node.childNodes.forEach((n, i) => {
      copySweet(n, cloneNode.childNodes[i])
    })
  }
}

export default copySweet
