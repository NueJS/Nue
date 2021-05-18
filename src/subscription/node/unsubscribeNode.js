/**
 * unsubscribe node from state, so that any change in state does not trigger updates on it
 * this is done when the node is removed from DOM and we don't want to do extra work of updating it
 * @param {ParsedDOMNode} node
 */

export const unsubscribeNode = (node) => {
  node._isSubscribed = false
  node._unsubscribers.forEach(dc => dc())
}
