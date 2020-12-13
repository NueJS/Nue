// import { REACTIVE } from '../constants.js'
import { setupConnection } from '../node/connections.js'
import handleInvalidPlaceholder from '../node/handleInvalidPlaceholder.js'

// @todo move this processing step from process node to in process template
function process_text_node (textNode) {
  const { get_value, deps } = textNode.sweet.placeholder
  const invalidPlaceholder = handleInvalidPlaceholder(textNode, textNode.sweet.placeholder)

  if (!invalidPlaceholder) {
    const update = () => { textNode.textContent = get_value() }
    setupConnection.call(this, textNode, deps, update)
  }
}

export default process_text_node
