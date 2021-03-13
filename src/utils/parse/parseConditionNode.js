import { ELSE_ATTRIBUTE, ENTER_ANIMATION, EXIT_ANIMATION, PARSED } from '../constants'
import { removeAttr, getAnimationAttributes } from '../node/dom'
import processPlaceholder from '../string/placeholder/processPlaceholder'

/**
 *
 * @param {import('../types').compNode} compNode
 * @param {string} attributeType // @todo use enum
 * @param {string} attributeValue
 */
const parseConditionNode = (compNode, attributeType, attributeValue) => {
  compNode[PARSED] = {
    ...compNode[PARSED],
    conditionType: attributeType,
    ...getAnimationAttributes(compNode)
  }
  if (attributeType !== ELSE_ATTRIBUTE) compNode[PARSED].condition = processPlaceholder(attributeValue);
  [ENTER_ANIMATION, EXIT_ANIMATION, attributeType].forEach(att => removeAttr(compNode, att))
}

export default parseConditionNode
