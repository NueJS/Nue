import { CONDITIONAL } from '../../constants.js'
import wire from '../../connection/wire'

// example: data-count=[XXX],  disabled:if=[XXx]
function addAttribute (comp, node, attribute) {
  const { placeholder, name, type } = attribute
  const { deps, getValue } = placeholder

  let update

  if (type === CONDITIONAL) {
    update = () => getValue(comp.$) ? node.setAttribute(name, '') : node.removeAttribute(name)
  }

  else {
    update = () => node.setAttribute(name, getValue(comp.$))
  }

  wire(comp, node, deps, update)
}

export default addAttribute
