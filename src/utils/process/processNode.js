import processTextNode from './processTextNode.js'
import processAttributes from './attributes/processAttributes.js'
import processIf from './processIf.js'
import processLoop from './loop/processLoop.js'
import { IF_ATTRIBUTE, NODES_USING_STATE, PARSED } from '../constants.js'
import isComp from '../node/isComp.js'

const processNode = (compNode, node) => {
  const { [PARSED]: parsed, nodeType } = node

  if (parsed) {
    const { conditionType, attributes } = parsed
    compNode[NODES_USING_STATE].add(node)

    if (parsed.isComp) {
      node.closure = compNode
      if (parsed.for) return processLoop(compNode, node, parsed)
      if (conditionType === IF_ATTRIBUTE) processIf(compNode, node, parsed)
    }
    else if (nodeType === Node.TEXT_NODE) processTextNode(compNode, node, parsed)
    if (attributes) processAttributes(compNode, node, attributes)
  }

  // if it a component, do not process it's child nodes
  if (!isComp(node) && node.hasChildNodes()) {
    node.childNodes.forEach(childNode => processNode(compNode, childNode))
  }
}

export default processNode
