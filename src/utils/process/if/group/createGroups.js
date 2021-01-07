import createGroup from './createGroup'
import getConditionNodes from './getConditionNodes'

const createGroups = (comp, ifNode) => {
  // get conditionNodes
  const conditionNodes = getConditionNodes(ifNode)
  const groups = conditionNodes.map((group) => createGroup(comp, group))

  return groups
}

export default createGroups
