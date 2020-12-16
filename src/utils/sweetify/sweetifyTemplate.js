import sweetifyAttributes from './sweetifyAttributes.js'
import sweetifyTextNode from './sweetifyTextNode.js'
import traverse from '../node/traverse.js'
import { supersweet } from '../../index.js'

function sweetifyTemplate () {
  const remove_nodes = []
  this.delayedPreprocesses = []

  // visit each node in template and memoize information
  const onVisit = node => {
    // memoize text content
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) remove_nodes.push(node)
      else sweetifyTextNode.call(this, node)
    }

    const compName = node.nodeName.toLowerCase()
    const isSweet = supersweet.components[compName]

    if (isSweet) {
      node.sweet = {
        isSweet: true,
        compName: compName
      }
    }

    // memoize attributes
    if (node.hasAttributes && node.hasAttributes()) {
      sweetifyAttributes.call(this, node)
    }
  }

  traverse(this.memo.template.content, onVisit, true)

  // remove redundant nodes
  this.delayedPreprocesses.forEach(m => m())
  remove_nodes.forEach(n => n.remove())
}

export default sweetifyTemplate
