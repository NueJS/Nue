import { setupConnection } from '../../node/connections.js'

// example: data-count=[XXX]
function addAttribute (node, attribute) {
  const { deps, getValue } = attribute.placeholder
  const update = () => node.setAttribute(attribute.name, getValue())
  setupConnection.call(this, node, deps, update)
}

export default addAttribute
