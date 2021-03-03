import { CONDITIONAL } from '../../constants.js'
import wire from '../../connection/wire'

const addAttribute = (compNode, node, attribute) => {
  const [{ deps, getValue }, name, type] = attribute
  let update
  if (type === CONDITIONAL) update = () => getValue(compNode) ? node.setAttribute(name, '') : node.removeAttribute(name)
  else update = () => node.setAttribute(name, getValue(compNode))
  wire(compNode, node, deps, update)
}

export default addAttribute
