import sweetifyAttributes from './sweetifyAttributes.js'
import sweetifyTextNode from './sweetifyTextNode.js'
import traverse from '../node/traverse.js'
import { supersweet } from '../../index.js'
import processPlaceholder from '../string/placeholder/processPlaceholder.js'
import { hasSlice } from '../state/slice.js'

function sweetifyTemplate () {
  const remove_nodes = []
  this.delayedPreprocesses = []

  // visit each node in template and memoize information
  const onVisit = node => {
    // memoize text content
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) remove_nodes.push(node)
      else sweetifyTextNode.call(this, node)
      return
    }

    const compName = node.nodeName.toLowerCase()
    const isSweet = supersweet.components[compName]

    if (isSweet) {
      node.sweet = {
        isSweet: true,
        compName: compName
      }

      node.sweet.childNodes = [...node.childNodes]
      node.innerHTML = '' // do not sweetify slot in parent component
      return
    }

    // if condition node
    if (node.nodeName === 'IF' || node.nodeName === 'ELSE' || node.nodeName === 'ELSE-IF') {
      const condition = node.getAttribute(':')
      const hasAnimate = node.hasAttribute('animate')
      node.sweet = {
        type: node.nodeName,
        condition: processPlaceholder.call(this, condition)
      }
      if (hasAnimate) node.sweet.animate = node.getAttribute('animate')
      return
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
