import { ELSE_ATTRIBUTE, IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, FOR_ATTRIBUTE } from '../../constants'
import { getAttr } from '../node/dom'
import { parseConditionComp } from './parseConditionComp'
import { parseIfComp } from './parseIfComp'
import { parseLoopedComp } from './parseLoopedComp'

/**
 * parse component node
 * @param {import('types/dom').Comp} comp
 * @param {string} compName
 * @param {Function[]} deferred
 */
export const parseComp = (comp, compName, deferred) => {
  comp._parsedInfo = {
    _isComp: true,
    _compName: compName,
    _attributes: []
  }

  const forAttribute = getAttr(comp, FOR_ATTRIBUTE)

  // if the component has FOR_ATTRIBUTE on it, it is looped component
  if (forAttribute) {
    parseLoopedComp(
      /** @type {import('types/dom').LoopedComp} */(comp),
      forAttribute
    )
  }

  else {
    const typeAndValue = usesConditionalAttribute(comp)
    if (typeAndValue) {
      const [type, value] = typeAndValue
      parseConditionComp(/** @type {import('types/dom').ConditionalComp}*/(comp), type, value)
      if (type === IF_ATTRIBUTE) {
        deferred.push(
          () => parseIfComp(/** @type {import('types/dom').IfComp} */(comp))
        )
      }
    }
  }
}

/**
 * if the comp has conditional Attribute, return [attributeName, value] else false
 * @param {import('types/dom').Comp} conditionComp
 * @returns {[import('types/parsed').ConditionAttribute, string] | false}
 */
const usesConditionalAttribute = conditionComp => {
  const conditionalAttributes = /** @type {import('types/parsed').ConditionAttribute[]}*/([IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, ELSE_ATTRIBUTE])
  for (const attributeName of conditionalAttributes) {
    const value = getAttr(conditionComp, attributeName)
    if (value !== null) return [attributeName, value]
  }
  return false
}
