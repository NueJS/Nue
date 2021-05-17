import { devInfo } from '../dev/devInfo'
import { batches } from '../enums'
import { subscribeMultiple } from './subscribe'

/**
 * subscribe node to state
 * @param {ParsedDOMElement} node
 */

export const subscribeNode = (node) => {
  if (!node._subscribers) return
  node._unsubscribers = node._subscribers.map(s => s())
  node._isSubscribed = true
}

/**
 * unsubscribe node to state
 * @param {ParsedDOMElement} node
 */

export const unsubscribeNode = (node) => {
  if (!node._unsubscribers) return
  node._unsubscribers.forEach(dc => dc())
  node._isSubscribed = false
}

/**
 * unsubscribe node to state
 * @param {ParsedDOMElement} node
 * @param {Function} subscriber
 */

export const addSubscriber = (node, subscriber) => {
  if (!node._subscribers) node._subscribers = []
  node._subscribers.push(subscriber)
}

// keep the dom node in sync with the state from comp
// by calling the update callback when deps change in state of comp
/**
 *
 * @param {Comp} comp
 * @param {ParsedDOMElement} node
 * @param {StatePath[]} deps
 * @param {SubCallBack} update
 */

export const syncNode = (comp, node, deps, update) => {
  // attach which node the update method is for so that when the update is called in batches
  // it can check whether to invoke it or not based on whether the node is subscribed or not
  update._node = node

  // when node is subscribed, call update so that node is up-to-date with state
  // returns unsubscriber function which removes subscription from comp subscriptions to prevent unnecessary dom updates
  const subscriber = () => {
    // @ts-expect-error
    update()

    if (_DEV_) devInfo.nodeUpdated(node)

    return subscribeMultiple(comp, deps, update, batches._DOM)
  }

  addSubscriber(node, subscriber)
}
