import { IS_SUBSCRIBED } from '../constants'

export const disconnectNode = (node) => {
  if (!node.unsubscribers) return
  node.unsubscribers.forEach(dc => dc())
  node[IS_SUBSCRIBED] = false
}

export default disconnectNode
