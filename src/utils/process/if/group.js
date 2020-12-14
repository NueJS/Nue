import { reverseForEach } from '../../others.js'
import { disconnect, connect } from '../../node/connections.js'
import traverse from '../../node/traverse.js'
import process_node from '../processNode.js'

const updateAnchor = (anchorNode, c) => {
  const len = anchorNode.textContent.length - c.length
  anchorNode.textContent = anchorNode.textContent.substr(0, len) + c
}

export function addGroup (group) {
  const { anchorNode } = group
  reverseForEach(group.nodes, node => {
    anchorNode.after(node)
    if (node.nodeType !== Node.TEXT_NODE) {
      if (group.animate) node.setAttribute('enter', '')
      traverse(node, connect)
    }
  })
  group.prevAdded = group.added
  group.added = true

  // update anchor node
  updateAnchor(anchorNode, ' ✅ ')
}

export function removeGroup (group) {
  const { anchorNode } = group
  group.nodes.forEach(node => {
    if (node.nodeType !== Node.TEXT_NODE) {
      if (group.animate) node.removeAttribute('exit')
      traverse(node, disconnect)
    }

    node.remove()
  })
  group.added = false

  updateAnchor(anchorNode, ' ❌ ')
}

export function processGroup (group) {
  group.nodes.forEach(node => {
    node.processed = false
    process_node.call(this, node)
  })
  group.processed = true
}
