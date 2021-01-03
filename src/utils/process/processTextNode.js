import wire from '../connection/wire.js'
import isInvalidPlaceholder from '../string/placeholder/isInvalidPlaceholder.js'

function processTextNode (comp, node) {
  const { getValue, deps } = node.sweet.placeholder
  const notPlaceholder = isInvalidPlaceholder(comp, getValue)

  if (notPlaceholder) {
    node.sweet = undefined
  }
  else {
    const update = () => {
      node.textContent = getValue(comp, node)
    }
    wire(comp, node, deps, update)
  }
}

export default processTextNode
