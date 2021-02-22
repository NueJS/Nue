import { CONDITIONAL } from '../../constants.js'
import wire from '../../connection/wire'

// example: data-count=[XXX],  disabled:if=[XXx]
function addAttribute (nue, node, attribute) {
  const { placeholder, name, type } = attribute
  const { deps, getValue } = placeholder

  let update

  if (type === CONDITIONAL) {
    update = () => getValue(nue) ? node.setAttribute(name, '') : node.removeAttribute(name)
  }

  else {
    update = () => node.setAttribute(name, getValue(nue))
  }

  wire(nue, node, deps, update)
}

export default addAttribute
