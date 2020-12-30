import sweetifyAttributes from './sweetifyAttributes.js'
import sweetifyTextNode from './sweetifyTextNode.js'
// import traverse from '../node/traverse.js'
import globalInfo from '../../globalInfo.js'
import processPlaceholder from '../string/placeholder/processPlaceholder.js'
import { isConditionNode } from '../node/dom.js'

function sweetifyTemplate (comp) {
  const uselessNodes = []
  comp.deferred = []

  // visit each node in template and memoize information
  const sweetify = node => {
    const compName = node.nodeName.toLowerCase()
    const isComp = globalInfo.components[compName]

    // memoize text content
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) uselessNodes.push(node)
      else sweetifyTextNode(comp, node)
      return // must use return here
    }

    else if (isComp) {
      node.sweet = {
        isComp: true,
        compName: compName
      }

      node.sweet.childNodes = [...node.childNodes]
      node.innerHTML = '' // do not sweetify slot in parent component
    }

    // if condition node
    else if (isConditionNode(node)) {
      const condition = node.getAttribute(':')
      node.sweet = {
        type: node.nodeName,
        condition: processPlaceholder(comp, condition),
        animate: node.getAttribute('animate')
      }
    }

    else if (node.hasAttribute) {
      sweetifyAttributes(comp, node)
    }

    if (node.nodeName === 'FOR') return

    if (node.hasChildNodes()) {
      node.childNodes.forEach(n => sweetify(n))
    }
  }

  comp.memo.template.content.childNodes.forEach(n => sweetify(n))

  // remove redundant nodes
  comp.deferred.forEach(m => m())
  uselessNodes.forEach(n => n.remove())
}

export default sweetifyTemplate
