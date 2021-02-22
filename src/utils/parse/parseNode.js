import { attr } from '../node/dom'
import parseAttributes from './parseAttributes'
import parseComp from './parseComp'
import parseConditionNode from './parseConditionNode'
import parseFor from './parseFor'
import parseTextNode from './parseTextNode'

const parseNode = (nue, _node) => {
  let node = _node
  const name = node.nodeName.toLowerCase()
  const { childComps } = nue.memo
  const isComp = childComps && childComps.has(name)

  if (isComp) {
    node = parseComp(name, node, _node)

    const forAttribute = attr(node, 'for')
    if (forAttribute) {
      parseFor(nue, node, forAttribute)
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

  if (node.hasAttribute) {
    parseAttributes(nue, node)
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach(n => parseNode(nue, n))
  }
}

export default parseNode
