/**
 * add subscriber in subscribers array
 * @param {ParsedDOMNode} node
 * @param {Subscriber} subscriber
 */

export const registerSubscriber = (node, subscriber) => {
  if (!node._subscribers) node._subscribers = []
  node._subscribers.push(subscriber)
}
