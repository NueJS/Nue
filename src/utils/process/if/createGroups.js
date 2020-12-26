import err from '../../dev/error.js'
import { disconnect } from '../../node/connections.js'
import { removeGroup } from './group.js'

const DEV = process.env.NODE_ENV !== 'production'

function createGroups (comp, ifNode, conditionNode = ifNode, groupDeps = [], groups = []) {
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
  let commentText = ''

  if (sweet.type !== 'ELSE') {
    const { getValue, deps, text } = sweet.condition
    deps.forEach(d => groupDeps.push(d))
    if (DEV) commentText = ` ${type} := ${text} ❌ `
    group.anchorNode = document.createComment(commentText)
    group.isSatisfied = () => getValue(comp)
  }

  else {
    if (DEV) commentText = ` ${type} ❌ `
    group.anchorNode = document.createComment(commentText)
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
  comp.delayedProcesses.push(() => {
    ifNode.before(group.anchorNode)
    group.nodes.forEach(n => n.remove())
  })

  for (const node of conditionNode.childNodes) {
    // if comp node is text node
    if (DEV && node.nodeType === Node.TEXT_NODE) {
      throw err({
        comp: comp,
        code: -1,
        link: '',
        message: 'text node is not direct child of <if> when animate attribute is added. wrap the textNode in span'
      })
    }

    // if is is condition node
    else if (node.nodeName === 'ELSIF' || node.nodeName === 'ELSE' || node.nodeName === 'IF') {
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
