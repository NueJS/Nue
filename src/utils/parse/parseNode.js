import { ELSE_ATTRIBUTE, ELSE_IF_ATTRIBUTE, FOR_ATTRIBUTE, IF_ATTRIBUTE, KEY_ATTRIBUTE } from '../constants'
import DEV from '../dev/DEV'
import errors from '../dev/errors'
import { attr } from '../node/dom'
import parseAttributes from './parseAttributes'
import parseConditionNode from './parseConditionNode'
import parseLoop from './parseLoop'
import parseTextNode from './parseTextNode'

const conditionalAttributes = [IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, ELSE_ATTRIBUTE]
const isConditionalNode = node => {
  for (const attributeName of conditionalAttributes) {
    const value = attr(node, attributeName)
    if (value !== null) return [attributeName, value]
  }
}

const parseNode = (node, parsingInfo) => {
  const isComp = node.nodeName in parsingInfo.component.childrenHash

  if (isComp) {
    node.parsed = {
      isComp: true
    }

    const forAttribute = attr(node, FOR_ATTRIBUTE)
    if (forAttribute) {
      parseLoop(node, forAttribute, parsingInfo)
    } else {
      const typeAndValue = isConditionalNode(node)
      if (typeAndValue) {
        const [type, value] = typeAndValue
        parseConditionNode(node, type, value)
        if (type === IF_ATTRIBUTE) parsingInfo.ifNodes.push(node)
      }
    }
  }

  else if (node.nodeType === Node.TEXT_NODE) {
    if (!node.textContent.trim()) parsingInfo.uselessNodes.push(node)
    else parseTextNode(node, parsingInfo)
    return
  }

  if (node.hasAttribute) {
    parseAttributes(node)

    // if component specific attributes are used on non-component nodes
    // if (DEV) {
    //   const compOnlyAttributes = [FOR_ATTRIBUTE, KEY_ATTRIBUTE, IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, ELSE_ATTRIBUTE]
    //   compOnlyAttributes.forEach(attrName => {
    //     if (attr(node, attrName)) {
    //       throw errors.RESERVED_ATTRIBUTE_USED_ON_NON_COMPONENT(parsingInfo.component.name, node, attrName)
    //     }
    //   })
    // }
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach(childNode => parseNode(childNode, parsingInfo))
  }
}

export default parseNode
