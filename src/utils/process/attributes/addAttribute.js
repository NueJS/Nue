import { wire } from '../../node/connections.js'

// example: data-count=[XXX]
function addAttribute (node, attribute) {
  const { placeholder, name } = attribute
  const { deps, getValue } = placeholder

  // update attribute value when called with latest from state
  const update = () => {
    node.setAttribute(name, getValue.call(this))
  }

  wire.call(this, node, deps, update)
}

export default addAttribute
