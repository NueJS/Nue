import { CONDITIONAL } from '../../constants.js'
import wire from '../../connection/wire'

// example: data-count=[XXX]
function addAttribute (comp, node, attribute) {
  const { placeholder, name, type } = attribute
  const { deps, getValue } = placeholder

  let update
  if (type === CONDITIONAL) {
    update = () => {
      const value = getValue(comp)
      if (value) node.setAttribute(name, value)
      else node.removeAttribute(name)
    }
  }

  // update attribute value when called with latest from state
  else {
    update = () => {
      node.setAttribute(name, getValue(comp))
    }
  }

  wire(comp, node, deps, update)
}

export default addAttribute
