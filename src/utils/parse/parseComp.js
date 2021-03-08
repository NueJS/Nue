import { ELSE_ATTRIBUTE, IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, PARSED, FOR_ATTRIBUTE } from '../constants'
import { getAttr } from '../node/dom'
import parseConditionNode from './parseConditionNode'
import parseIf from './parseIf'
import parseLoop from './parseLoop'

const conditionalAttributes = [IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, ELSE_ATTRIBUTE]

const usesConditionalAttribute = compNode => {
  for (const attributeName of conditionalAttributes) {
    const value = getAttr(compNode, attributeName)
    if (value !== null) return [attributeName, value]
  }
}

const parseComp = (node, compName, deferred) => {
  node[PARSED] = {
    isComp: true,
    name: compName
  }

  const forAttribute = getAttr(node, FOR_ATTRIBUTE)

  // if the component has FOR_ATTRIBUTE on it, it is looped component
  if (forAttribute) {
    parseLoop(node, forAttribute)
  } else {
    const typeAndValue = usesConditionalAttribute(node)
    if (typeAndValue) {
      const [type, value] = typeAndValue
      parseConditionNode(node, type, value)
      if (type === IF_ATTRIBUTE) deferred.push(() => parseIf(node))
    }
  }
}

export default parseComp
