import processTextNode from './processTextNode.js'
import processAttributes from './attributes/processAttributes.js'
import processIf from './if/if.js'
import processFor from './for/processFor.js'

function processNode (comp, node) {
  const { sweet, nodeType, nodeName } = node
  if (sweet) {
    if (sweet.isProcessed) return
    sweet.isProcessed = true

    // save the comp as closure of component
    if (sweet.isComp) node.sweet.closure = comp
    else if (nodeType === Node.TEXT_NODE) processTextNode(comp, node)
    else if (nodeName === 'IF') processIf(comp, node)
    else if (nodeName === 'FOR') processFor(comp, node)
    if (node.hasAttribute) processAttributes(comp, node)
  }

  if (nodeName === 'FOR') return

  if (node.hasChildNodes()) {
    node.childNodes.forEach(n => processNode(comp, n))
  }
}

export default processNode
