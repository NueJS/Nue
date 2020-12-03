import processTextContent from './processTextContent.js'
import processAttributes from './processAttributes.js'
import commentIf from './commentIf.js'

// this number is use to find memoized information from this.memo.nodes for a node
let i = 0
function processNode (node, context) {
  i++
  // get memoized info
  const memo = this.memo.nodes[i]

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
        commentIf.call(this, node, memo)
      }
    }

    else {
      processAttributes.call(this, node, memo)
    }
  }
}

export default processNode
