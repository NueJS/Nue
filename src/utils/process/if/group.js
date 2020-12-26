import { reverseForEach } from '../../others.js'
import { connect, disconnect } from '../../node/connections.js'
// import traverse from '../../node/traverse.js'
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
  process.env.NODE_ENV !== 'production' && updateAnchor(anchorNode, ' ✅ ')
}

export function removeGroup (group) {
  const { anchorNode } = group

  group.nodes.forEach(node => {
    node.removeAttribute('exit')
    disconnect(node)
    node.remove()
  })

  group.isRendered = false
  process.env.NODE_ENV !== 'production' && updateAnchor(anchorNode, ' ❌ ')
}

export function processGroup (comp, group) {
  group.nodes.forEach(node => {
    if (node.sweet) node.sweet.isProcessed = false
    processNode(comp, node)
  })
  group.isProcessed = true
}
