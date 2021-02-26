import processTextNode from './processTextNode.js'
import processAttributes from './attributes/processAttributes.js'
import processIf from './processIf.js'
import processLoop from './loop/processLoop.js'

const processNode = (nue, node) => {
  const { parsed, nodeType } = node
  if (parsed) {
    nue.processedNodes.add(node)
    // save the nue as closure of component
    if (parsed.isComp) {
      parsed.closure = nue
      if (parsed.for) return processLoop(nue, node, parsed)
      if (parsed.conditionType === 'if') processIf(nue, node, parsed)
    }
    else if (nodeType === Node.TEXT_NODE) processTextNode(nue, node, parsed)
    if (node.hasAttribute) processAttributes(nue, node, parsed)
  }

  // if it a component, do not process it's child nodes
  if (!(parsed && parsed.isComp) && node.hasChildNodes()) {
    node.childNodes.forEach(n => processNode(nue, n))
  }
}

export default processNode
