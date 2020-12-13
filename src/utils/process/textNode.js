import { setupConnection } from '../node/connections.js'
import { handleInvalidPlaceholder } from '../string/placeholder.js'

function processTextNode (node) {
  const { getValue, deps } = node.sweet.placeholder
  const invalidPlaceholder = handleInvalidPlaceholder(node, node.sweet.placeholder)

  if (!invalidPlaceholder) {
    const update = () => {
      if (node.sweet.isConnected) node.textContent = getValue()
    }
    setupConnection.call(this, node, deps, update)
  }
}

export default processTextNode
