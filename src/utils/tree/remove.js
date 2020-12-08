import traverse from './traverse.js'
import { animate_exit } from '../node/animate.js'
import { disconnect } from '../node/connections.js'

/**
 * remove the $ listeners from all children of the node
 * then remove the node from DOM
 * @param {Element} element - node which is to be removed from DOM
 */

function remove_node (element) {
  traverse(element, node => disconnect(node))

  const remove = () => {
    element.style.background = 'red'
  }
  animate_exit(element, remove)
}

export default remove_node
