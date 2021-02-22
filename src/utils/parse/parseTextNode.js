import { TEXT } from '../constants.js'
import split from '../string/split.js'

function parseTextNode (nue, node) {
  const placeholders = split(nue, node.textContent.trim())
  const textNodes = []

  placeholders.forEach(placeholder => {
    const textNode = document.createTextNode(placeholder.text)
    if (placeholder.type !== TEXT) {
      textNode.parsed = { placeholder }
    }

    textNodes.push(textNode)
  })

  // after all memoization is done, replace the node with textNodes
  nue.deferred.push(() => {
    textNodes.forEach(t => node.before(t))
    node.remove()
  })
}

export default parseTextNode
