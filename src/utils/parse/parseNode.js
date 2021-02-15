import { attr } from '../node/dom'
import parseAttributes from './parseAttributes'
import parseComp from './parseComp'
import parseConditionNode from './parseConditionNode'
import parseFor from './parseFor'
import parseTextNode from './parseTextNode'

const parseNode = (comp, _node) => {
  let node = _node
  const name = node.nodeName.toLowerCase()
  const { childComps } = comp.memo
  const isComp = childComps && childComps.has(name)

  if (isComp) {
    node = parseComp(name, node, _node)

    const forAttribute = attr(node, 'for')
    if (forAttribute) {
      parseFor(comp, node, forAttribute)
    }

    let type
    if (node.hasAttribute('if')) type = 'if'
    else if (node.hasAttribute('else-if')) type = 'else-if'
    else if (node.hasAttribute('else')) type = 'else'
    if (type) {
      parseConditionNode(node, type)
    }
    if (type === 'if') {
      comp.ifNodes.push(node)
    }
  }

  else if (node.nodeType === Node.TEXT_NODE) {
    if (!node.textContent.trim()) comp.uselessNodes.push(node)
    else parseTextNode(comp, node)
    return
  }

  if (node.hasAttribute) {
    parseAttributes(comp, node)
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach(n => parseNode(comp, n))
  }
}

export default parseNode
