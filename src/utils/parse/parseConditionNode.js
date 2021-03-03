import { ELSE_ATTRIBUTE, ENTER_ANIMATION, EXIT_ANIMATION, PARSED } from '../constants'
import { attr, removeAttr } from '../node/dom'
import processPlaceholder from '../string/placeholder/processPlaceholder'

const parseConditionNode = (node, type, value) => {
  node[PARSED] = {
    ...node[PARSED],
    conditionType: type,
    enter: attr(node, ENTER_ANIMATION),
    exit: attr(node, EXIT_ANIMATION)
  }
  if (type !== ELSE_ATTRIBUTE) node[PARSED].condition = processPlaceholder(value)
  removeAttr(node, type)
}

export default parseConditionNode
