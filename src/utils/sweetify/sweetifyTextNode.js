import { TEXT } from '../constants.js'
import split from '../string/split.js'

function sweetifyTextNode (comp, node) {
  const placeholders = split(comp, node.textContent.trim())
  const textNodes = []

  placeholders.forEach(placeholder => {
    const textNode = document.createTextNode(placeholder.text)
    if (placeholder.type !== TEXT) {
      textNode.sweet = { placeholder }
    }

    textNodes.push(textNode)
  })

  // after all memoization is done, replace the node with textNodes
  comp.deferred.push(() => {
    textNodes.forEach(t => node.before(t))
    node.remove()
  })
}

export default sweetifyTextNode
