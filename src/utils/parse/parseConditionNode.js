import { ELSE_ATTRIBUTE, ENTER_ANIMATION, EXIT_ANIMATION } from '../constants'
import { attr } from '../node/dom'
import processPlaceholder from '../string/placeholder/processPlaceholder'

const parseConditionNode = (node, type, value) => {
  node.parsed = {
    ...node.parsed,
    conditionType: type,
    enter: attr(node, ENTER_ANIMATION),
    exit: attr(node, EXIT_ANIMATION)
  }
  if (type !== ELSE_ATTRIBUTE) node.parsed.condition = processPlaceholder(value)
  node.removeAttribute(type)
}

export default parseConditionNode
