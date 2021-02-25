// disconnectNode the node from state
export function disconnectNode (node) {
  // if the node does not use state
  if (!node.unsubscribers) return
  // if node is disconnected from state already, do nothing
  if (!node.isSubscribed) return
  // run all unsubscribe functions
  node.unsubscribers.forEach(dc => dc())
  node.isSubscribed = false
}

export default disconnectNode
