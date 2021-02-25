export const connectNode = (node) => {
  if (!node.subscribers) return
  node.unsubscribers = node.subscribers.map(s => s())
  node.isSubscribed = true
}

export default connectNode
