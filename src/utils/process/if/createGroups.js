import { disconnect } from '../../node/connections.js'
import traverse from '../../node/traverse.js'
import satisfies from './comparison.js'
import { removeGroup } from './group.js'

function createGroups (ifNode, conditionNode = ifNode, groupDeps = [], groups = []) {
  const { sweet } = conditionNode
  let lastNode
  let compareWith
  const type = conditionNode.nodeName
  const animate = conditionNode.hasAttribute('animate')

  // group creation ---------------------------
  const group = {
    conditionNode,
    nodes: [],
    isRendered: false,
    isProcessed: false,
    disconnect: () => {
      group.nodes.forEach(node => traverse(node, disconnect))
    },
    onRemove: (cb) => {
      lastNode.addEventListener('animationend', cb, { once: true })
    }
  }

  groups.push(group)

  if (type !== 'ELSE') {
    const { placeholder } = sweet.attributes[0]

    // add deps on conditionNode to groupDeps
    placeholder.deps.forEach(d => groupDeps.push(d))

    // @TODO - do not trust that 0th with be the condition
    compareWith = sweet.attributes[0].name

    group.anchorNode = document.createComment(` ${conditionNode.nodeName} ${compareWith}=${placeholder.text} ❌ `)

    group.isSatisfied = () => {
      const value = placeholder.getValue.call(this)
      return satisfies(value, compareWith)
    }
  }

  else {
    group.anchorNode = document.createComment(` ${conditionNode.nodeName} ❌ `)
    // else does not have any condition and thus is always satisfied
    group.isSatisfied = () => true
  }

  // if group has animate, add animate attribute on all the nodes in the group
  if (animate) {
    group.animate = conditionNode.getAttribute('animate')
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
      if (animate) node.classList.add(group.animate)
      // do not process node
      if (node.sweet) node.sweet.isProcessed = true
    }
  }

  lastNode = group.nodes[group.nodes.length - 1]

  return { groups, groupDeps }
}

export default createGroups
