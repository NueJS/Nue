import processTextNode from './textNode.js'
import process_attributes from './attributes/processAttributes.js'
import process_if from './if/if.js'
import { render, supersweet } from '../../index.js'

function processNode (node, context) {
  if (node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
    if (node.processed) return
    node.processed = true

    if (node.sweet.placeholder && node.nodeType === Node.TEXT_NODE) processTextNode.call(this, node)
    else if (node.nodeName === 'IF') process_if.call(this, node)
    else if (node.hasAttribute) process_attributes.call(this, node)

    if (node.sweet.isSweet && !supersweet.processedComponents[node.sweet.compName]) {
      render(node.sweet.compName)
    }
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach(n => processNode.call(this, n, context))
  }
}

export default processNode
