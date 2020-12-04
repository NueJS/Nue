import traverse from './traverse.js'
import { animate_exit } from '../node/animate.js'

/**
 * remove the $ listeners from all children of the node
 * then remove the node from DOM
 * @param {Element} element - node which is to be removed from DOM
 */

function remove_node (element) {
  traverse(element, node => {
    if (node.removeStateListener) node.removeStateListener()
    if (node.onRemove) node.onRemove()
  })

  const remove = () => element.remove()
  animate_exit(element, remove)
}

export default remove_node
