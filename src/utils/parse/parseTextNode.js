import { PARSED, TEXT } from '../constants.js'
import split from '../string/split.js'

const parseTextNode = (node, deferred) => {
  const trimmedText = node.textContent.trim()

  // if the node is only empty string, it will be normalized by DOM, so remove it
  if (!trimmedText) {
    deferred.push(() => node.remove())
    return
  }

  const parts = split(node.textContent)
  const textNodes = []

  // for each part create a text node
  // if it's not TEXT type, save the part info in parsed.placeholder
  parts.forEach(part => {
    const textNode = document.createTextNode(part.text)
    textNodes.push(textNode)
    if (part.type !== TEXT) textNode[PARSED] = { placeholder: part }
  })

  // replace the original node with new textNodes
  deferred.push(() => {
    textNodes.forEach(textNode => node.before(textNode))
    node.remove()
  })
}

export default parseTextNode
