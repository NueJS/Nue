import processTextContent from './text-content.js'
import processAttributes from './attributes/all.js'
import process_condition from './condition.js'
import process_map from './map.js'

// this number is use to find memoized information from this.memo.nodes for a node
function process_node (node) {
  this.memoId++
  node.id = this.memoId
  // get memoized info
  const memo = this.memo.nodes[this.memoId]

  // ignore if the node is processed
  if (node.processed) return

  // mark the node as processed to avoid processing the node again
  // this might happen when processing conditional rendering, mapping etc
  node.processed = true

  // process textContent only if it is text
  if (node.nodeName === '#text') {
    processTextContent.call(this, node)
  }

  else if (memo) {
    if (node.nodeName === '#comment') {
      if (memo.type === 'if') {
        process_condition.call(this, node, memo)
      } else if (memo.type === 'for') {
        // process_map.call(this, node, memo)
      }
    }

    else {
      processAttributes.call(this, node, memo)
    }
  }
}

export default process_node
