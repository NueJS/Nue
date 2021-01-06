import { disconnect } from '../../connection/recursive.js'
import DEV from '../../dev/DEV.js'
import errors from '../../dev/errors.js'
import { animate, isConditionNode, onAnimationEnd } from '../../node/dom.js'
import { removeGroup } from './group.js'

function createGroups (comp, ifNode, conditionNode = ifNode, groupDeps = [], groups = []) {
  const { sweet } = conditionNode
  const { type } = sweet

  // console.log('group)

  const group = {
    conditionNode,
    nodes: [],
    isRendered: false,
    isProcessed: false,
    disconnect: () => group.nodes.forEach(disconnect),
    enter: sweet.enter,
    exit: sweet.exit,

    // run callback after the group is removed from DOM
    onRemove: (cb) => onAnimationEnd(lastNode, cb)
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

  const removeSelf = () => removeGroup(group)
  // define group.remove
  // if group has animate, add animate attribute on all the nodes in the group
  if (sweet.exit) {
    group.remove = () => {
      group.nodes.forEach(node => {
        animate(node, sweet.exit)
        onAnimationEnd(node, () => animate(node, null))
      })

      onAnimationEnd(lastNode, removeSelf)
    }
  }

  else {
    group.remove = removeSelf
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
        errors.TEXTNODE_DIRECT_CHILD_OF_IF(comp, node)
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
