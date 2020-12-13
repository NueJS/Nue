function createGroups (conditionNode, deps, groups, anchorNode) {
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

  if (sweet.attributes.length) {
    const { placeholder } = sweet.attributes[0]
    group.placeholder = placeholder
    group.compareWith = sweet.attributes[0].name
    placeholder.deps.forEach(d => deps.push(d))
  }

  groups.push(group)

  conditionNode.childNodes.forEach(node => {
    if (node.nodeName === 'ELSIF' || node.nodeName === 'ELSE' || node.nodeName === 'IF') {
      createGroups.call(this, node, deps, groups, anchorNode)
      this.delayed_processes.push(() => anchorNode.after(node))
    } else {
      group.nodes.push(node)
      node.processed = true
      if (group.animate) node.setAttribute('animate', group.animate)
    }
  })
}

export default createGroups
