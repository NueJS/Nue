import memoAttributes from './sweetifyAttributes.js'
import memoText from './sweetifyTextNode.js'
import traverse from '../node/traverse.js'

function sweetifyTemplate () {
  const remove_nodes = []
  this.delayedPreprocesses = []

  // visit each node in template and memoize information
  const onVisit = node => {
    node.sweet = {}
    // memoize text content
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) remove_nodes.push(node)
      else memoText.call(this, node)
    }

    // memoize attributes
    else if (node.hasAttributes && node.hasAttributes()) {
      memoAttributes.call(this, node)
    }
  }

  traverse(this.memo.template.content, onVisit, true)

  // remove redundant nodes
  this.delayedPreprocesses.forEach(m => m())
  remove_nodes.forEach(n => n.remove())
}

export default sweetifyTemplate
