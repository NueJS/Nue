import { TEXT } from '../constants.js'
import split from '../string/split.js'

const parseTextNode = (node, deferred) => {
  const placeholders = split(node.textContent.trim())
  const textNodes = []

  placeholders.forEach(placeholder => {
    const textNode = document.createTextNode(placeholder.text)
    if (placeholder.type !== TEXT) textNode.parsed = { placeholder }
    textNodes.push(textNode)
  })

  // after all memoization is done, replace the node with textNodes
  deferred.push(() => {
    textNodes.forEach(t => node.before(t))
    node.remove()
  })
}

export default parseTextNode
