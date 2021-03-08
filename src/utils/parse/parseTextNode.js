import { PARSED, TEXT } from '../constants.js'
import split from '../string/split.js'

const parseTextNode = (node, deferred) => {
  // @todo maybe we need to remove first then parseIf
  if (!node.textContent.trim()) {
    deferred.push(() => node.remove())
    return
  }

  const placeholders = split(node.textContent.trim())
  const textNodes = []

  placeholders.forEach(placeholder => {
    const textNode = document.createTextNode(placeholder.text)
    if (placeholder.type !== TEXT) textNode[PARSED] = { placeholder }
    textNodes.push(textNode)
  })

  // after all memoization is done, replace the node with textNodes
  deferred.push(() => {
    textNodes.forEach(t => node.before(t))
    node.remove()
  })
}

export default parseTextNode
