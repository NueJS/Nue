import devtools from '../../apis/devtools'
import { DOM_BATCH, IS_SUBSCRIBED } from '../constants'
import DEV from '../dev/DEV'
import { subscribeMultiple } from './subscribe'

/**
 * subscribe node to state
 * @param {import('../types').parsedNode} node
 */
export const subscribeNode = (node) => {
  if (!node.subscribers) return
  node.unsubscribers = node.subscribers.map(s => s())
  node[IS_SUBSCRIBED] = true
}

/**
 * unsubscribe node to state
 * @param {import('../types').parsedNode} node
 */
export const unsubscribeNode = (node) => {
  if (!node.unsubscribers) return
  node.unsubscribers.forEach(dc => dc())
  node[IS_SUBSCRIBED] = false
}

/**
 * unsubscribe node to state
 * @param {import('../types').parsedNode} node
 * @param {Function} subscriber
 */
export const addSubscriber = (node, subscriber) => {
  if (!node.subscribers) node.subscribers = []
  node.subscribers.push(subscriber)
}

// keep the dom node in sync with the state from compNode
// by calling the update callback when deps change in state of compNode
/**
 *
 * @param {import('../types').compNode} compNode
 * @param {import('../types').parsedNode} node
 * @param {Array<import('../types').path>} deps
 * @param {import('../types').subscribeCallback} update
 */
export const syncNode = (compNode, node, deps, update) => {
  // attach which node the update method is for so that when the update is called in batches
  // it can check whether to invoke it or not based on whether the node is subscribed or not
  // @ts-ignore @todo fix it
  update.node = node

  // when node is subscribed, call update so that node is up-to-date with state
  // returns unsubscriber function which removes subscription from compNode subscriptions to prevent unnecessary dom updates
  const subscriber = () => {
    // @ts-ignore
    update()

    if (DEV) devtools.nodeUpdated(node)
    return subscribeMultiple(compNode, deps, update, DOM_BATCH)
  }

  addSubscriber(node, subscriber)
}
