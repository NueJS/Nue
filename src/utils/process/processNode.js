import processTextNode from './textNode.js'
import processAttributes from './attributes/processAttributes.js'
import processIf from './if/if.js'
import { render, supersweet } from '../../index.js'
import processFor from './for/processFor.js'

function processNode (node, context) {
  if (node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE && node.sweet) {
    if (node.sweet.isProcessed) return
    node.sweet.isProcessed = true

    if (node.sweet.isSweet) {
      node.sweet.closure = {
        $: this.$,
        fn: this.fn,
        component: this
      }
      if (!supersweet.processedComponents[node.sweet.compName]) render(node.sweet.compName)
    }

    if (node.sweet.placeholder && node.nodeType === Node.TEXT_NODE) processTextNode.call(this, node)
    else if (node.nodeName === 'IF') processIf.call(this, node)
    else if (node.nodeName === 'FOR') processFor.call(this, node)
    else if (node.hasAttribute) processAttributes.call(this, node)
  }

  if (node.hasChildNodes() && node.nodeName !== 'FOR') {
    node.childNodes.forEach(n => processNode.call(this, n, context))
  }
}

export default processNode
