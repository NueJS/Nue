import { CONDITIONAL } from '../../constants.js'
import { wire } from '../../node/connections.js'

// example: data-count=[XXX]
function addAttribute (node, attribute) {
  const { placeholder, name, type } = attribute
  const { deps, getValue } = placeholder

  let update
  if (type === CONDITIONAL) {
    update = () => {
      const value = getValue.call(this)
      if (value) node.setAttribute(name, value)
      else node.removeAttribute(name)
    }
  }

  // update attribute value when called with latest from state
  else {
    update = () => {
      node.setAttribute(name, getValue.call(this))
    }
  }

  wire.call(this, node, deps, update)
}

export default addAttribute
