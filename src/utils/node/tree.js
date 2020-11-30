import { handleAnimateExit, handleAnimateEnter } from './animate.js'

/**
 * recursively traverse the node and call cb for each of its child
 * @param {Node} node - node for which we want to traverse its tree
 * @param {Function} cb - callback function
 */

export function traverseTree (node, cb) {
  cb(node)
  const hasChild = node.hasChildNodes()
  if (hasChild) {
    node.childNodes.forEach(n => {
      traverseTree(n, cb)
    })
  }
}

/**
 * remove the state listeners from all children of the node
 * then remove the node from DOM
 * @param {Element} element - node which is to be removed from DOM
 */

export function removeTree (element) {
  traverseTree(element, node => {
    if (node.removeStateListener) {
      node.removeStateListener()
    }
  })

  const remove = () => element.remove()
  handleAnimateExit(element, remove)
}

/**
 * add back the state change listeners to all child nodes of node
 * and the then add the node to DOM
 * @param {Element} element
 * @param {Element} anchorNode
 */

export function addTree (element, anchorNode) {
  traverseTree(element, node => {
    if (node.addStateListener) node.addStateListener()
  })

  anchorNode.after(element)
  handleAnimateEnter(element)
}
