import { ELSE_ATTRIBUTE, ENTER_ATTRIBUTE, EXIT_ATTRIBUTE } from '../../constants'
import { removeAttr, getAnimationAttributes } from '../node/dom'
import { processPlaceholder } from '../string/placeholder/processPlaceholder'

/**
 * parsed conditional component
 * @param {import('types/dom').ConditionalComp} comp
 * @param {import('types/parsed').ConditionAttribute} conditionType
 * @param {string} attributeValue
 */
export const parseConditionComp = (comp, conditionType, attributeValue) => {
  comp._parsedInfo = {
    ...comp._parsedInfo,
    _conditionType: conditionType,
    _animationAttributes: getAnimationAttributes(comp)
  }

  if (conditionType !== ELSE_ATTRIBUTE) {
    /** @type {import('types/dom').IfComp}*/
    (comp)._parsedInfo._conditionAttribute = processPlaceholder(attributeValue)
  };

  [ENTER_ATTRIBUTE, EXIT_ATTRIBUTE, conditionType].forEach(att => removeAttr(comp, att))
}
