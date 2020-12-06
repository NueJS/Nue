import processTextContent from './text-content.js'
import processAttributes from './attributes/all.js'
import process_condition from './condition.js'
import process_map from './map.js'
import process_if from './if.js'

// m_id is just for the conditional and mapping
// when cloning the node, ids are removed from the node
// that's why
function process_node (node, context) {
  const memo = this.memo_of(node)
  // if node is fragment, don't process it, go to its childNodes
  if (memo) {
    // ignore if the node is processed
    if (node.processed) return
    node.processed = true

    if (node.nodeName === Node.TEXT_NODE) {
      processTextContent.call(this, node, memo, context)
    }

    else if (node.nodeName === 'IF') {
      process_if.call(this, node)
    }

    // else if (node.nodeName === '#comment') {
    //   if (memo.type === 'if') {
    //     process_condition.call(this, node, memo, context)
    //   } else if (memo.type === 'for') {
    //     process_map.call(this, node, memo, context)
    //   }
    // }

    else {
      processAttributes.call(this, node, memo, context)
    }
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach(n => process_node.call(this, n, context))
  }
}

export default process_node
