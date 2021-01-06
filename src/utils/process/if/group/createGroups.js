import createGroup from './createGroup'
import getConditionNodes from './getConditionNodes'

const createGroups = (comp, ifNode) => {
  // get conditionNodes
  const conditionNodes = getConditionNodes(ifNode)
  const groups = conditionNodes.map((group) => createGroup(comp, group))

  groups.forEach(group => {
  // after processed
  // remove conditionNode, and all the nodes
  // add comment anchorNode
    comp.deferred.push(() => {
      ifNode.before(group.anchorNode)
      group.nodes.forEach(n => n.remove())
    })
  })

  return groups
}

export default createGroups
