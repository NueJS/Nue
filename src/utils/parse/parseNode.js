import DEV from '../dev/DEV'
import errors from '../dev/errors'
import { attr } from '../node/dom'
import parseAttributes from './parseAttributes'
import parseConditionNode from './parseConditionNode'
import parseLoop from './parseLoop'
import parseTextNode from './parseTextNode'

const parseNode = (node, parsingInfo) => {
  const isComp = node.nodeName in parsingInfo.component.childrenHash

  if (isComp) {
    node.parsed = {
      isComp: true
    }

    const forAttribute = attr(node, 'for')
    if (forAttribute) {
      parseLoop(node, forAttribute, parsingInfo)
    }

    let type
    if (node.hasAttribute('if')) type = 'if'
    else if (node.hasAttribute('else-if')) type = 'else-if'
    else if (node.hasAttribute('else')) type = 'else'
    if (type) {
      parseConditionNode(node, type)
    }
    if (type === 'if') {
      parsingInfo.ifNodes.push(node)
    }
  }

  else if (node.nodeType === Node.TEXT_NODE) {
    if (!node.textContent.trim()) parsingInfo.uselessNodes.push(node)
    else parseTextNode(node, parsingInfo)
    return
  }

  if (node.hasAttribute) {
    parseAttributes(node)

    if (DEV) {
      ['for', 'key', 'if', 'else-if', 'else'].forEach(attrName => {
        if (attr(node, attrName)) {
          throw errors.RESERVED_ATTRIBUTE_USED_ON_NON_COMPONENT(parsingInfo.component.name, node, attrName)
        }
      })
    }
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach(childNode => parseNode(childNode, parsingInfo))
  }
}

export default parseNode
