import { CONDITIONAL } from '../../constants.js'
import { removeAttr, setAttr } from '../../node/dom.js'
import { syncNode } from '../../subscription/node.js'

/**
 *
 * @param {import('../../types.js').compNode} compNode
 * @param {Element} element
 * @param {import('../../types.js').attribute} attribute
 */
const addAttribute = (compNode, element, attribute) => {
  const [{ deps, getValue }, name, type] = attribute
  let update
  if (type === CONDITIONAL) update = () => getValue(compNode) ? setAttr(compNode, name, '') : removeAttr(element, name)
  else update = () => setAttr(element, name, getValue(compNode))
  syncNode(compNode, element, deps, update)
}

export default addAttribute
