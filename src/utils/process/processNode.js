import processTextNode from './processTextNode.js'
import processAttributes from './attributes/processAttributes.js'
import processIf from './if/if.js'
import processFor from './for/processFor.js'

function processNode (comp, node) {
  const { parsed, nodeType, nodeName } = node
  if (parsed) {
    if (parsed.isProcessed) return
    parsed.isProcessed = true

    // save the comp as closure of component
    if (parsed.isComp) {
      node.parsed.closure = comp
      if (parsed.for) processFor(comp, node)
    }
    else if (nodeType === Node.TEXT_NODE) processTextNode(comp, node)
    else if (nodeName === 'IF') processIf(comp, node)
    if (node.hasAttribute) processAttributes(comp, node)
  }

  if (nodeName === 'FOR') return

  if (node.hasChildNodes()) {
    node.childNodes.forEach(n => processNode(comp, n))
  }
}

export default processNode
