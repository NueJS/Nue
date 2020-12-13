import { reverseForEach } from '../../others.js'
import { disconnect, connect } from '../../node/connections.js'
import traverse from '../../node/traverse.js'
import process_node from '../processNode.js'

export function addGroup (group, anchor_node) {
  reverseForEach(group.nodes, node => {
    anchor_node.after(node)
    traverse(node, connect)
    if (group.prevAdded !== undefined) node.setAttribute('enter', '')
  })
  group.prevAdded = group.added
  group.added = true
}

export function removeGroup (group) {
  group.nodes.forEach(node => {
    node.removeAttribute('exit')
    traverse(node, disconnect)
    node.remove()
  })
  group.added = false
}

export function processGroup (group) {
  group.nodes.forEach(node => {
    node.processed = false
    process_node.call(this, node)
  })
  group.processed = true
}
