import { attr, isConditionNode } from '../node/dom'
import parseAttributes from './parseAttributes'
import parseComp from './parseComp'
import parseConditionNode from './parseConditionNode'
import parseFor from './parseFor'
import parseTextNode from './parseTextNode'

const parseNode = (comp, _node, uselessNodes) => {
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
  }

  else if (node.nodeType === Node.TEXT_NODE) {
    if (!node.textContent.trim()) uselessNodes.push(node)
    else parseTextNode(comp, node)
    return
  }

  else if (isConditionNode(node)) {
    parseConditionNode(node)
  }

  if (node.hasAttribute) {
    parseAttributes(comp, node)
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach(n => parseNode(comp, n, uselessNodes))
  }
}

export default parseNode
