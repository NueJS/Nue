import { reverseForEach } from '../../others.js'
import { connect, connectNode, disconnect } from '../../node/connections.js'
import traverse from '../../node/traverse.js'
import processNode from '../processNode.js'

const updateAnchor = (anchorNode, c) => {
  const len = anchorNode.textContent.length - c.length
  anchorNode.textContent = anchorNode.textContent.substr(0, len) + c
}

export function addGroup (group) {
  const { anchorNode } = group
  reverseForEach(group.nodes, node => {
    anchorNode.after(node)
    if (group.animate) node.setAttribute('enter', '')
    connect(node)
  })

  group.isRendered = true

  // update anchor node
  updateAnchor(anchorNode, ' ✅ ')
}

export function removeGroup (group) {
  const { anchorNode } = group

  group.nodes.forEach(node => {
    node.removeAttribute('exit')
    disconnect(node)
    node.remove()
  })

  group.isRendered = false
  updateAnchor(anchorNode, ' ❌ ')
}

export function processGroup (group) {
  group.nodes.forEach(node => {
    if (node.sweet) node.sweet.isProcessed = false
    processNode.call(this, node)
  })
  group.isProcessed = true
}
