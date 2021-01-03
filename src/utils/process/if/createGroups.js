import { disconnect } from '../../connection/recursive.js'
import DEV from '../../dev/DEV.js'
import errors from '../../dev/errors.js'
import { isConditionNode } from '../../node/dom.js'
import { removeGroup } from './group.js'

function createGroups (comp, ifNode, conditionNode = ifNode, groupDeps = [], groups = []) {
  const { sweet } = conditionNode
  const { type } = sweet

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
  group.anchorNode = document.createComment('')

  if (sweet.type !== 'ELSE') {
    const { getValue, deps, text } = sweet.condition
    deps.forEach(d => groupDeps.push(d))
    if (DEV) {
      group.anchorNode.textContent = ` ${type} := ${text} ❌ `
    }
    group.isSatisfied = () => getValue(comp)
  }

  else {
    if (DEV) {
      group.anchorNode.textContent = ` ${type} ❌ `
    }
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
  comp.deferred.push(() => {
    ifNode.before(group.anchorNode)
    group.nodes.forEach(n => n.remove())
  })

  for (const node of conditionNode.childNodes) {
    if (DEV) {
      if (node.nodeType === Node.TEXT_NODE) {
        errors.TEXTNODE_DIRECT_CHILD_OF_IF(comp)
      }
    }

    // if is is condition node
    if (isConditionNode(node)) {
      createGroups(comp, ifNode, node, groupDeps, groups)
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
