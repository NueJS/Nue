import { ELSE_ATTRIBUTE, ENTER_ANIMATION, EXIT_ANIMATION, PARSED } from '../constants'
import { removeAttr, getAnimationAttributes } from '../node/dom'
import processPlaceholder from '../string/placeholder/processPlaceholder'

const parseConditionNode = (node, type, value) => {
  node[PARSED] = {
    ...node[PARSED],
    conditionType: type,
    ...getAnimationAttributes(node)
  }
  if (type !== ELSE_ATTRIBUTE) node[PARSED].condition = processPlaceholder(value);
  [ENTER_ANIMATION, EXIT_ANIMATION, type].forEach(att => removeAttr(node, att))
}

export default parseConditionNode
