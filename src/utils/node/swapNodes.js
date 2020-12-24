function swapNodes (node1, node2) {
  let type = 'before'
  let anchor = node2.nextSibling
  if (!anchor) {
    anchor = node2.previousSibling
    type = 'after'
  }
  node1.replaceWith(node2)
  anchor[type](node1)
}

export default swapNodes
