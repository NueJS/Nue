import { setupConnection } from '../../node/connections.js'

// get the value of slice having the given path and set the attribute value
// when the slice changes, update the value of attribute as well
function process_attribute (node, info) {
  const { deps, get_value } = info.placeholder
  const update = () => node.setAttribute(info.name, get_value())
  setupConnection.call(this, node, deps, update)
}

export default process_attribute
