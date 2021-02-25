// disconnectNode the node from state
export function disconnectNode (node) {
  if (!node.parsed) return
  const { parsed } = node
  // if node is disconnected from state already, do nothing
  if (!node.isSubscribed) return

  // if the node can be disconnected
  if (parsed.disconnects) {
    parsed.disconnects.forEach(dc => dc())
    node.isSubscribed = false
  }
}

export default disconnectNode
