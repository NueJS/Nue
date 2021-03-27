
import { animationAttributes, conditionAttributes } from '../../constants'
import { removeAttr, getAnimationAttributes } from '../node/dom'
import { processPlaceholder } from '../string/placeholder/processPlaceholder'

/**
 * parsed conditional component
 * @param {ConditionalComp} comp
 * @param {ConditionAttribute} conditionType
 * @param {string} attributeValue
 */
export const parseConditionComp = (comp, conditionType, attributeValue) => {

  comp._parsedInfo = {
    ...comp._parsedInfo,
    _conditionType: conditionType,
    _animationAttributes: getAnimationAttributes(comp)
  }

  if (conditionType !== conditionAttributes._else) {
    /** @type {IfComp}*/
    (comp)._parsedInfo._conditionAttribute = processPlaceholder(attributeValue)
  };

  [animationAttributes._enter, animationAttributes._exit, conditionType]
    .forEach(att => removeAttr(comp, att))
}
