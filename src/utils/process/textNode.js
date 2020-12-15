import { setupConnection } from '../node/connections.js'
import { handleInvalidPlaceholder } from '../string/placeholder.js'

function processTextNode (node) {
  const { getValue, deps } = node.sweet.placeholder
  const invalidPlaceholder = handleInvalidPlaceholder.call(this, node, node.sweet.placeholder)

  if (!invalidPlaceholder) {
    const update = () => {
      if (node.sweet.isConnected) node.textContent = getValue.call(this, node)
    }
    setupConnection.call(this, node, deps, update)
  }
}

export default processTextNode
