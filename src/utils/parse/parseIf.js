import { ELSE_ATTRIBUTE, IF_ATTRIBUTE, PARSED } from '../constants'
import { createComment } from '../node/dom'

/**
 * parse if condition node
 * @param {import('../types').compNode} ifNode
 */
const parseIf = (ifNode) => {
  /** @type {Array<import('../types').compNode}>} */
  const group = []

  let node = ifNode.nextElementSibling

  // create a starting marker which will be used to add conditional nodes to DOM
  const anchorNode = createComment('if')
  ifNode.before(anchorNode)

  // keep checking the next node
  while (true) {
    // get the conditionType of the node
    // @ts-ignore
    const type = node && node[PARSED] && node[PARSED].conditionType
    // if the node is not a condition node or is a separate condition, break the loop
    if (!type || (type === IF_ATTRIBUTE)) break
    // @ts-ignore
    group.push(node)
    // @ts-ignore
    node = node.nextElementSibling
  }

  // add a end if marker after the last node in group
  // if ifNode is alone, add after it
  (group[group.length - 1] || ifNode).after(createComment('/if'))

  // remove other nodes from template
  group.forEach(n => n.remove())

  // @ts-ignore
  const groupDeps = [ifNode[PARSED].condition.deps]
  group.forEach(node => {
    // @ts-ignore
    if (node[PARSED].conditionType !== ELSE_ATTRIBUTE) {
      // @ts-ignore
      groupDeps.push(node[PARSED].condition.deps)
    }
  })

  ifNode[PARSED] = { ...ifNode[PARSED], group, groupDeps, anchorNode }
}

export default parseIf
