import { CONDITIONAL } from '../../constants.js'
import { removeAttr, setAttr } from '../../node/dom.js'
import { syncNode } from '../../subscription/node.js'

const addAttribute = (compNode, node, attribute) => {
  const [{ deps, getValue }, name, type] = attribute
  let update
  if (type === CONDITIONAL) update = () => getValue(compNode) ? setAttr(compNode, name, '') : removeAttr(node, name)
  else update = () => setAttr(node, name, getValue(compNode))
  syncNode(compNode, node, deps, update)
}

export default addAttribute
