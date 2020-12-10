import { reverseForEach } from '../../others.js'
import { disconnect, connect } from '../../node/connections.js'
import traverse from '../../tree/traverse.js'
import process_node from '../node.js'

export const add_group = (group, anchor_node) => {
  reverseForEach(group.nodes, (node, i) => {
    anchor_node.after(node)
    traverse(node, connect)
    node.setAttribute('enter', '')
  })
  group.added = true
}

export const remove_group = (group) => {
  group.nodes.forEach(node => {
    node.removeAttribute('exit')
    traverse(node, disconnect)
    node.remove()
  })
  group.added = false
}

export function process_group (group) {
  group.processed = true
  group.nodes.forEach(n => {
    n.processed = false
    process_node.call(this, n)
  })
}
