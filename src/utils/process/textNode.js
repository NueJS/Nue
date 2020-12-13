import { setupConnection } from '../node/connections.js'
import handleInvalidPlaceholder from '../node/handleInvalidPlaceholder.js'

function processTextNode (node) {
  const { get_value, deps } = node.sweet.placeholder
  const invalidPlaceholder = handleInvalidPlaceholder(node, node.sweet.placeholder)

  if (!invalidPlaceholder) {
    const update = () => {
      if (node.sweet.isConnected) node.textContent = get_value()
    }
    setupConnection.call(this, node, deps, update)
  }
}

export default processTextNode
