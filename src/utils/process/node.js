import process_text_node from './text_node.js'
import process_attributes from './attributes/all.js'
import process_if from './conditional_rendering/if.js'

function process_node (node, context) {
  if (node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
    // console.log(node.nodeName, node.memo_id)
    if (node.processed) return
    node.processed = true

    if (this.memo_of(node)) {
      if (node.nodeType === Node.TEXT_NODE) process_text_node.call(this, node, context)
      else if (node.nodeName === 'IF') process_if.call(this, node)
      else if (node.hasAttribute) process_attributes.call(this, node, context)
    }
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach(n => process_node.call(this, n, context))
  }
}

export default process_node
