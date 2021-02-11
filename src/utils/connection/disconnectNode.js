// disconnectNode the node from state
// after disconnecting, no state mutation should affect the node
// disconnecting involves removing its dep from this.deps map
export function disconnectNode (node) {
  if (!node.parsed) return
  const { parsed } = node
  // if node is disconnected from state already, do nothing
  if (!parsed.isConnected) return

  // if the node can be disconnected
  if (parsed.disconnects) {
    parsed.disconnects.forEach(dc => dc())
    parsed.isConnected = false
  }
}

export default disconnectNode
