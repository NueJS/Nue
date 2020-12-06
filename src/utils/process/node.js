import processTextContent from './text_node.js'
import processAttributes from './attributes/all.js'
// import process_condition from './condition.js'
// import process_map from './map.js'
import process_if from './if.js'

// m_id is just for the conditional and mapping
// when cloning the node, ids are removed from the node
// that's why
function process_node (node, context) {
  if (node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
    if (node.processed) return
    node.processed = true

    if (node.nodeType === Node.TEXT_NODE) {
      processTextContent.call(this, node, context)
    }

    else if (node.nodeName === 'IF') {
      process_if.call(this, node)
    }

    else {
      processAttributes.call(this, node, context)
    }
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach(n => process_node.call(this, n, context))
  }
}

export default process_node
