import { TEXT } from '../constants.js'
import split from '../string/split.js'

function memoText (node) {
  const placeholders = split.call(this, node.textContent.trim())
  const textNodes = []

  placeholders.forEach(placeholder => {
    let textNode

    if (placeholder.type === TEXT) {
      textNode = document.createTextNode(placeholder.text)
      textNode.supersweet = {}
    } else {
      textNode = document.createTextNode('')
      textNode.supersweet = { placeholder }
    }

    textNodes.push(textNode)
  })

  // after all memoization is done, replace the node with textNodes
  this.delayed_memoizations.push(() => {
    textNodes.forEach(t => node.before(t))
    node.remove()
  })
}

export default memoText