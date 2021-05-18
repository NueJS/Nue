/**
 * subscribe node to state so that if the state is changed, node will be updated
 * @param {ParsedDOMNode} node
 */

export const subscribeNode = (node) => {
  node._isSubscribed = true
  node._unsubscribers = node._subscribers.map(s => s())
}
