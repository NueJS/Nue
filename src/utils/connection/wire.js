import { DOM_BATCH } from '../constants'
import { subscribeMultiple } from '../state/subscribe'
import { addSubscriber } from './addSubscriber'

// create subscriber and add to subscribers array
const wire = (compNode, node, deps, update) => {
  // attach which node the update method is for so that when the update is called in batches
  // it can check whether to invoke it or not based on whether the node is subscribed or not
  update.node = node

  // when node is subscribed, call update so that node is up-to-date with state
  // and return unsubscriber function to removed the added subscription
  const subscriber = () => {
    update()
    return subscribeMultiple(compNode, deps, update, DOM_BATCH)
  }

  addSubscriber(node, subscriber)
}

export default wire
