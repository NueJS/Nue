export const addSubscriber = (node, subscriber) => {
  if (!node.subscribers) node.subscribers = []
  node.subscribers.push(subscriber)
}
