import { ELSE_ATTRIBUTE, ENTER_ANIMATION, EXIT_ANIMATION, PARSED } from '../constants'
import { getAttr, removeAttr } from '../node/dom'
import processPlaceholder from '../string/placeholder/processPlaceholder'

const parseConditionNode = (node, type, value) => {
  node[PARSED] = {
    ...node[PARSED],
    conditionType: type,
    enter: getAttr(node, ENTER_ANIMATION),
    exit: getAttr(node, EXIT_ANIMATION)
  }
  if (type !== ELSE_ATTRIBUTE) node[PARSED].condition = processPlaceholder(value)
  removeAttr(node, type)
}

export default parseConditionNode
