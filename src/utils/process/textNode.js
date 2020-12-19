import { wire } from '../node/connections.js'
import isInvalidPlaceholder from '../string/placeholder/isInvalidPlaceholder.js'

function processTextNode (node) {
  const { getValue, deps, text } = node.sweet.placeholder
  const notPlaceholder = isInvalidPlaceholder(this, getValue)

  if (!notPlaceholder) {
    const update = () => {
      if (node.sweet.isConnected) {
        node.textContent = getValue.call(this, node)
      }
    }
    wire.call(this, node, deps, update)
  } else {
    node.textContent = text
    node.sweet = undefined
  }
}

export default processTextNode
