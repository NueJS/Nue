import traverse from './traverse.js'
import { animate_enter } from '../node/animate.js'
import settings from '../../settings.js'
import { connect } from '../node/connections.js'

/**
 * add back the $ change listeners to all child nodes of node
 * and the then add the node to DOM
 * @param {Element} element
 * @param {Element} anchorNode
 */

function add_node (element, anchorNode) {
  // element.style.background = 'green'
  traverse(element, connect)

  anchorNode.after(element)
  if (settings.showUpdates) settings.onNodeUpdate(element)
  animate_enter(element)
}

export default add_node
