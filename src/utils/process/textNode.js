import { wire } from '../node/connections.js'
import isInvalidPlaceholder from '../string/placeholder/isInvalidPlaceholder.js'

function processTextNode (comp, node) {
  const { getValue, deps, text } = node.sweet.placeholder
  const notPlaceholder = isInvalidPlaceholder(comp, getValue)

  if (!notPlaceholder) {
    const update = () => {
      node.textContent = getValue(comp, node)
    }
    wire(comp, node, deps, update)
  } else {
    node.textContent = text
    node.sweet = undefined
  }
}

export default processTextNode
