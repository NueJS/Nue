import DEV from '../dev/DEV'
import errors from '../dev/errors'
import { attr } from '../node/dom'
import { lower } from '../others'
import parseAttributes from './parseAttributes'
import parseComp from './parseComp'
import parseConditionNode from './parseConditionNode'
import parseLoop from './parseLoop'
import parseTextNode from './parseTextNode'

const parseNode = (nue, _node) => {
  let node = _node
  const { childComps } = nue.memo
  const compName = childComps[node.nodeName]

  if (compName) {
    node = parseComp(compName, node, _node)

    const forAttribute = attr(node, 'for')
    if (forAttribute) {
      parseLoop(nue, node, forAttribute)
    }

    let type
    if (node.hasAttribute('if')) type = 'if'
    else if (node.hasAttribute('else-if')) type = 'else-if'
    else if (node.hasAttribute('else')) type = 'else'
    if (type) {
      parseConditionNode(node, type)
    }
    if (type === 'if') {
      nue.ifNodes.push(node)
    }
  }

  else if (node.nodeType === Node.TEXT_NODE) {
    if (!node.textContent.trim()) nue.uselessNodes.push(node)
    else parseTextNode(nue, node)
    return
  }

  else if (DEV) {
    ['for', 'key', 'if', 'else-if', 'else'].forEach(attrName => {
      if (attr(node, attrName)) {
        throw errors.RESERVED_ATTRIBUTE_USED_ON_NON_COMPONENT(nue.name, node, attrName)
      }
    })
  }

  if (node.hasAttribute) {
    parseAttributes(nue, node)
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach(n => parseNode(nue, n))
  }
}

export default parseNode
