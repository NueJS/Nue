import { ELSE_ATTRIBUTE, ELSE_IF_ATTRIBUTE, FOR_ATTRIBUTE, IF_ATTRIBUTE, KEY_ATTRIBUTE, PARSED } from '../constants'
import DEV from '../dev/DEV'
import errors from '../dev/errors'
import { getAttr } from '../node/dom'
import parseAttributes from './parseAttributes'
import parseConditionNode from './parseConditionNode'
import parseLoop from './parseLoop'
import parseTextNode from './parseTextNode'
import parseIf from './parseIf'

const conditionalAttributes = [IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, ELSE_ATTRIBUTE]

const usesConditionalAttribute = compNode => {
  for (const attributeName of conditionalAttributes) {
    const value = getAttr(compNode, attributeName)
    if (value !== null) return [attributeName, value]
  }
}

const parseNode = (node, childCompNodeNames, deferred, name) => {
  // it is a component if the node's nodeName is in the childCompNodeNames set
  const compName = childCompNodeNames[node.nodeName]

  if (compName) {
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

  else if (node.nodeType === Node.TEXT_NODE) {
    // @todo maybe we need to remove first then parseIf
    if (!node.textContent.trim()) deferred.push(() => node.remove())
    else parseTextNode(node, deferred)
    return
  }

  if (node.hasAttribute) {
    parseAttributes(node)

    // if component specific attributes are used on non-component nodes
    if (DEV && !compName) {
      const compOnlyAttributes = [FOR_ATTRIBUTE, KEY_ATTRIBUTE, IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, ELSE_ATTRIBUTE]
      compOnlyAttributes.forEach(attrName => {
        if (getAttr(node, attrName)) {
          throw errors.RESERVED_ATTRIBUTE_USED_ON_NON_COMPONENT(name, node, attrName)
        }
      })
    }
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach(childNode => parseNode(childNode, childCompNodeNames, deferred, name))
  }
}

export default parseNode
