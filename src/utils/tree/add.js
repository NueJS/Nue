import traverse from './traverse.js'
import { animate_enter } from '../node/animate.js'

/**
 * add back the $ change listeners to all child nodes of node
 * and the then add the node to DOM
 * @param {Element} element
 * @param {Element} anchorNode
 */

function add_node (element, anchorNode) {
  traverse(element, node => {
    if (node.addStateListener) node.addStateListener()
  })

  // console.log('add : ', element)
  anchorNode.after(element)
  animate_enter(element)
}

export default add_node
