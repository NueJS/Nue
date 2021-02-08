import sweetifyAttributes from './sweetifyAttributes.js'
import sweetifyTextNode from './sweetifyTextNode.js'
// import traverse from '../node/traverse.js'
import globalInfo from '../globalInfo.js'
import processPlaceholder from '../string/placeholder/processPlaceholder.js'
import { isConditionNode } from '../node/dom.js'

function sweetifyTemplate (comp) {
  const uselessNodes = []
  comp.deferred = []

  // visit each node in template and memoize information
  const sweetify = _node => {
    let node = _node
    const name = node.nodeName.toLowerCase()
    const { childComps } = comp.memo
    const isComp = childComps && childComps.has(name)

    if (isComp) {
      // child nodes (slot) of child component should not be sweetified and saved in array instead
      _node.innerHTML = ''
      const newNode = document.createElement(name + '-')
      _node.replaceWith(newNode)
      newNode.sweet = {
        isComp: true,
        name,
        childNodes: [...node.childNodes]
      }

      // copy attributes
      for (const attributeName of node.getAttributeNames()) {
        const attributeValue = node.getAttribute(attributeName)
        newNode.setAttribute(attributeName, attributeValue)
      }

      node = newNode
    }

    // memoize text content
    else if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) uselessNodes.push(node)
      else sweetifyTextNode(comp, node)
      return // must use return here
    }

    // if condition node
    else if (isConditionNode(node)) {
      node.sweet = {
        type: node.nodeName,
        enter: node.getAttribute('enter'),
        exit: node.getAttribute('exit')
      }

      if (node.nodeName !== 'ELSE') {
        const condition = node.getAttribute(':')
        node.sweet.condition = processPlaceholder(condition)
      }
    }

    if (node.hasAttribute) {
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
