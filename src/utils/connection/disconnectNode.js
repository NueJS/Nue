// disconnectNode the node from state
// after disconnecting, no state mutation should affect the node
// disconnecting involves removing its dep from this.deps map
export function disconnectNode (node) {
  if (!node.sweet) return
  const { sweet } = node
  // if node is disconnected from state already, do nothing
  if (!sweet.isConnected) return

  // if the node can be disconnected
  if (sweet.disconnects) {
    sweet.disconnects.forEach(dc => dc())
    sweet.isConnected = false
  }
}

export default disconnectNode
