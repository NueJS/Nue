import { IS_SUBSCRIBED } from '../constants'

export const connectNode = (node) => {
  if (!node.subscribers) return
  node.unsubscribers = node.subscribers.map(s => s())
  node[IS_SUBSCRIBED] = true
}

export default connectNode
