import { CONDITIONAL } from '../../constants.js'
import wire from '../../connection/wire'
import { removeAttr, setAttr } from '../../node/dom.js'

const addAttribute = (compNode, node, attribute) => {
  const [{ deps, getValue }, name, type] = attribute
  let update
  if (type === CONDITIONAL) update = () => getValue(compNode) ? setAttr(compNode, name, '') : removeAttr(node, name)
  else update = () => setAttr(node, name, getValue(compNode))
  wire(compNode, node, deps, update)
}

export default addAttribute
