import { setupConnection } from '../../node/connections.js'

// example: data-count=[XXX]
function addNormalAttribute (node, attribute) {
  const { deps, get_value } = attribute.placeholder
  const update = () => node.setAttribute(attribute.name, get_value())
  setupConnection.call(this, node, deps, update)
}

export default addNormalAttribute
