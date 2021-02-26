import { CONDITIONAL } from '../../constants.js'
import wire from '../../connection/wire'

const addAttribute = (nue, node, attribute) => {
  const [{ deps, getValue }, name, type] = attribute
  let update
  if (type === CONDITIONAL) update = () => getValue(nue) ? node.setAttribute(name, '') : node.removeAttribute(name)
  else update = () => node.setAttribute(name, getValue(nue))
  wire(nue, node, deps, update)
}

export default addAttribute
