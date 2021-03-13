import { ELSE_ATTRIBUTE, IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, PARSED, FOR_ATTRIBUTE } from '../constants'
import { getAttr } from '../node/dom'
import parseConditionNode from './parseConditionNode'
import parseIf from './parseIf'
import parseLoop from './parseLoop'

const conditionalAttributes = [IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, ELSE_ATTRIBUTE]

/** @typedef {import('../types').compNode} compNode */

/**
 * if the compNode has conditional Attribute, return [attributeName, value] else false
 * @param {compNode} compNode
 * @returns {[string, string] | false}
 */
const usesConditionalAttribute = compNode => {
  for (const attributeName of conditionalAttributes) {
    const value = getAttr(compNode, attributeName)
    if (value !== null) return [attributeName, value]
  }
  return false
}

/**
 * parse component node
 * @param {compNode} compNode
 * @param {string} compName
 * @param {Array<Function>} deferred
 */
const parseComp = (compNode, compName, deferred) => {
  compNode[PARSED] = {
    isComp: true,
    name: compName
  }

  const forAttribute = getAttr(compNode, FOR_ATTRIBUTE)

  // if the component has FOR_ATTRIBUTE on it, it is looped component
  if (forAttribute) {
    parseLoop(compNode, forAttribute)
  }

  else {
    const typeAndValue = usesConditionalAttribute(compNode)
    if (typeAndValue) {
      const [type, value] = typeAndValue
      parseConditionNode(compNode, type, value)
      if (type === IF_ATTRIBUTE) deferred.push(() => parseIf(compNode))
    }
  }
}

export default parseComp
