// connectNode the node to state
export function connectNode (node) {
  // if node does not have subscribers, it can't be connected
  if (!node.subscribers) return
  // if node is subscribed, no need to subscribe
  if (node.isSubscribed) {
    // @find: when will this happen
    console.log('node is already subscribed!')
    return
  }

  // run all subscribe functions and get unsubscribe functions
  node.unsubscribers = node.subscribers.map(s => s())

  // must set isSubscribed to true so that updates actually update
  node.isSubscribed = true

  // node.updates.forEach(u => u())
}

export default connectNode
