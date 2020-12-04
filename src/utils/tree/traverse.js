
/**
 * recursively traverse the node and call cb for each of its child
 * @param {Node} node - node for which we want to traverse its tree
 * @param {Function} cb - callback function
 */

function traverse (node, cb) {
  cb(node)
  const hasChild = node.hasChildNodes()
  if (hasChild) {
    node.childNodes.forEach(n => {
      traverse(n, cb)
    })
  }
}

export default traverse
