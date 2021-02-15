import { attr } from '../node/dom'
import processPlaceholder from '../string/placeholder/processPlaceholder'

const parseConditionNode = (node, type) => {
  const condition = type !== 'else' && processPlaceholder(attr(node, type))

  node.parsed = {
    ...node.parsed,
    conditionType: type,
    enter: attr(node, 'enter'),
    exit: attr(node, 'exit'),
    condition
  }
  node.removeAttribute(type)
}

export default parseConditionNode
