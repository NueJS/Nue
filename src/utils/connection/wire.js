import { subscribeMultiple } from '../state/subscribe'
import { addSubscriber } from './addSubscriber'

// setup updates, subscribers and unsubscribers array
const wire = (nue, node, deps, update) => {
  // attach which node the update method is for so that when the update is called in queue
  // it can check whether to invoke it or not based on whether the node is subscribed or not
  update.node = node

  // when node is subscribed, call update so that node is up-to-date with state
  // and return unsubscriber function to removed the added subscription
  const subscriber = () => {
    update()
    return subscribeMultiple(nue, deps, update, 'dom')
  }

  addSubscriber(node, subscriber)
}

export default wire
