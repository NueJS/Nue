
import { animationAttributes, conditionAttributes } from '../constants'
import { getAnimationAttributes, removeAttr } from '../dom/attributes'
import { processPlaceholder } from '../string/placeholder/processPlaceholder'

const { _enter, _exit } = animationAttributes

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

  const attributesToRemove = [_enter, _exit, conditionType]

  attributesToRemove.forEach(att => removeAttr(comp, att))
}
