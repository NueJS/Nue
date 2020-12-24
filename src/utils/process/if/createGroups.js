import { disconnect } from '../../node/connections.js'
import { removeGroup } from './group.js'

function createGroups (ifNode, conditionNode = ifNode, groupDeps = [], groups = []) {
  const { sweet } = conditionNode
  const { type } = sweet

  // group creation ---------------------------
  const group = {
    conditionNode,
    nodes: [],
    isRendered: false,
    isProcessed: false,
    disconnect: () => group.nodes.forEach(disconnect),
    onRemove: (cb) => {
      lastNode.addEventListener('animationend', cb, { once: true })
    }
  }

  groups.push(group)
  let text = ''

  if (sweet.type !== 'ELSE') {
    const { getValue, deps, text } = sweet.condition
    deps.forEach(d => groupDeps.push(d))
    if (DEV) text = ` ${type} := ${text} ❌ `
    group.anchorNode = document.createComment(text)
    group.isSatisfied = () => getValue.call(this)
  }

  else {
    if (DEV) text = ` ${type} ❌ `
    group.anchorNode = document.createComment(text)
    group.isSatisfied = () => true
  }

  // if group has animate, add animate attribute on all the nodes in the group
  if (sweet.animate) {
    group.remove = () => {
      group.nodes.forEach(node => node.setAttribute('exit', ''))
      lastNode.addEventListener('animationend', () => removeGroup(group), { once: true })
    }
  }

  else {
    group.remove = () => removeGroup(group)
  }

  // after processed
  // remove conditionNode, and all the nodes
  // add comment anchorNode
  this.delayedProcesses.push(() => {
    ifNode.before(group.anchorNode)
    group.nodes.forEach(n => n.remove())
  })

  for (const node of conditionNode.childNodes) {
    // if this node is text node
    if (node.nodeType === Node.TEXT_NODE) {
      throw new Error('text node is not direct child of <if> when animate attribute is added. wrap the textNode in span')
    }

    // if is is condition node
    else if (node.nodeName === 'ELSIF' || node.nodeName === 'ELSE' || node.nodeName === 'IF') {
      createGroups.call(this, ifNode, node, groupDeps, groups)
    }

    else {
      group.nodes.push(node)
      // add class given in the group.animate to all the direct child nodes
      if (sweet.animate) node.classList.add(group.animate)
      // do not process node
      if (node.sweet) node.sweet.isProcessed = true
    }
  }

  const lastNode = group.nodes[group.nodes.length - 1]

  return { groups, groupDeps }
}

export default createGroups
