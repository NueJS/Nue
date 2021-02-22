import processTextNode from './processTextNode.js'
import processAttributes from './attributes/processAttributes.js'
import processIf from './processIf.js'
import processLoop from './loop/processLoop.js'

function processNode (nue, node) {
  const { parsed, nodeType } = node
  if (parsed) {
    // save the nue as closure of component
    if (parsed.isComp) {
      parsed.closure = nue
      if (parsed.for) return processLoop(nue, node)
      if (parsed.conditionType === 'if') processIf(nue, node)
    }
    else if (nodeType === Node.TEXT_NODE) processTextNode(nue, node)
    if (node.hasAttribute) processAttributes(nue, node)
  }

  // if it a component, do not process it's child nodes
  if (!(parsed && parsed.isComp) && node.hasChildNodes()) {
    node.childNodes.forEach(n => processNode(nue, n))
  }
}

export default processNode
