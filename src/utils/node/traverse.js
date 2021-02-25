// recursively traverse the node and call cb for each of its child
// if ignore is true, ignore the root node
const traverse = (node, cb, ignoreRoot = false) => {
  if (!ignoreRoot) cb(node)
  if (node.hasChildNodes()) node.childNodes.forEach(n => traverse(n, cb))
}

export default traverse
