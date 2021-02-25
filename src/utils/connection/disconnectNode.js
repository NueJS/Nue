export const disconnectNode = (node) => {
  if (!node.unsubscribers) return
  node.unsubscribers.forEach(dc => dc())
  node.isSubscribed = false
}

export default disconnectNode
