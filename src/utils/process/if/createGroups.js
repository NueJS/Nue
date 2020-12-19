function createGroups (conditionNode, deps, groups, ifNode) {
  const { sweet } = conditionNode

  const group = {
    type: conditionNode.nodeName,
    nodes: [],
    added: false,
    prevAdded: undefined,
    processed: false,
    conditionNode,
    animate: conditionNode.getAttribute('animate')

  }

  if (sweet && sweet.attributes) {
    const { placeholder } = sweet.attributes[0]
    group.placeholder = placeholder
    group.compareWith = sweet.attributes[0].name
    group.anchorNode = document.createComment(` ${conditionNode.nodeName} ${group.compareWith}=[${group.placeholder.content}] ❌ `)
    placeholder.deps.forEach(d => deps.push(d))
  } else {
    group.anchorNode = document.createComment(` ${conditionNode.nodeName} ❌ `)
  }

  groups.push(group)

  // after creating the groups, add anchorNodes for each group
  this.delayedProcesses.push(() => {
    ifNode.before(group.anchorNode)
  })

  conditionNode.childNodes.forEach(node => {
    if (node.nodeName === 'ELSIF' || node.nodeName === 'ELSE' || node.nodeName === 'IF') {
      createGroups.call(this, node, deps, groups, ifNode)
    } else {
      group.nodes.push(node)
      // pretend as if this is processed to avoid the traverse function from processing this node
      if (node.sweet) node.sweet.isProcessed = true

      // if group has animate, add animate attribute on all the nodes in the group
      if (group.animate) node.setAttribute('animate', group.animate)
    }
  })
}

export default createGroups
