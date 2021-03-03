import { ELSE_ATTRIBUTE, ENTER_ANIMATION, EXIT_ANIMATION, PARSED } from '../constants'
import { attr } from '../node/dom'
import processPlaceholder from '../string/placeholder/processPlaceholder'

const parseConditionNode = (node, type, value) => {
  node[PARSED] = {
    ...node[PARSED],
    conditionType: type,
    enter: attr(node, ENTER_ANIMATION),
    exit: attr(node, EXIT_ANIMATION)
  }
  if (type !== ELSE_ATTRIBUTE) node[PARSED].condition = processPlaceholder(value)
  node.removeAttribute(type)
}

export default parseConditionNode
