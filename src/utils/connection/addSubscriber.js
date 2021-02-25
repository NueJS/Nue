export function addSubscriber (node, subscriber) {
  if (!node.subscribers) node.subscribers = []
  node.subscribers.push(subscriber)
}
