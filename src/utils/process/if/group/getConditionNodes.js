import { isConditionNode } from '../../../node/dom'

const getConditionNodes = (ifNode) => {
  // get conditionNodes
  const conditionNodes = []

  // recursively find condition nodes inside give condition nodes
  const saveConditionNode = (conditionNode) => {
    conditionNodes.push(conditionNode)
    conditionNode.childNodes.forEach(node => {
      if (isConditionNode(node)) {
        saveConditionNode(node)
      }
    })
  }

  saveConditionNode(ifNode)

  return conditionNodes
}

export default getConditionNodes
