import { TEXT } from '../constants.js'
import split from '../string/split.js'

function memoize_text_content (node) {
  const placeholders = split.call(this, node.textContent.trim())
  const textNodes = []

  placeholders.forEach(placeholder => {
    this.memo_id++
    let textNode

    if (placeholder.type === TEXT) {
      textNode = document.createTextNode(placeholder.text)
    } else {
      // check if the node is empty string, remove it then
      this.memo.nodes[this.memo_id] = placeholder
      textNode = document.createTextNode('')
    }

    textNodes.push(textNode)
  })

  // after all memoization is done, replace the node with textNodes
  this.delayed_memoizations.push(() => {
    textNodes.forEach(t => node.before(t))
    node.remove()
  })
}

export default memoize_text_content
