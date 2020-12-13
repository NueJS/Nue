// recursively traverse the node and call cb for each of its child
// if ignore is true, ignore the root node
function traverse (node, cb, ignore = false) {
  if (!ignore) cb(node)
  const hasChild = node.hasChildNodes()
  if (hasChild) {
    node.childNodes.forEach(n => {
      traverse(n, cb)
    })
  }
}

export default traverse
