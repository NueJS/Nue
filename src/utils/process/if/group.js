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
  console.log('anchor: ', anchorNode)
  reverseForEach(group.nodes, node => {
    anchorNode.after(node)
    if (group.animate) node.setAttribute('enter', '')
    traverse(node, connect)
  })

  group.isRendered = true

  // update anchor node
  updateAnchor(anchorNode, ' ✅ ')
}

export function removeGroup (group) {
  const { anchorNode } = group

  group.nodes.forEach(node => {
    node.removeAttribute('exit')
    node.remove()
  })

  group.nodes.forEach(node => traverse(node, disconnect))

  group.isRendered = false
  updateAnchor(anchorNode, ' ❌ ')
}

export function processGroup (group) {
  group.nodes.forEach(node => {
    node.isProcessed = false
    process_node.call(this, node)
  })
  group.isProcessed = true
}
