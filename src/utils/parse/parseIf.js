import { createComment } from '../node/dom'

const parseIf = (comp) => {
  comp.ifNodes.forEach(ifNode => {
    const group = []
    let node = ifNode.nextElementSibling

    // create a starting marker which will be used to add conditional nodes to DOM
    const anchorNode = createComment('if')
    ifNode.before(anchorNode)

    // keep checking the next node
    while (true) {
      // get the conditionType of the node
      const type = node && node.parsed && node.parsed.conditionType
      // if the node is not a condition node or is a separate condition, break the loop
      if (!type || (type === 'if')) break
      group.push(node)
      node = node.nextElementSibling
    }

    // add a end if marker after the last node in group
    // if ifNode is alone, add after it
    (group[group.length - 1] || ifNode).after(createComment('/if'))

    // remove other nodes from template
    group.forEach(n => n.remove())

    const groupDeps = [ifNode.parsed.condition.deps]
    group.forEach(node => {
      if (node.parsed.conditionType !== 'else') {
        groupDeps.push(node.parsed.condition.deps)
      }
    })

    ifNode.parsed = { ...ifNode.parsed, group, groupDeps, anchorNode }
  })
}

export default parseIf
