import { BEFORE_DOM_BATCH } from '../../constants'
import { subscribeMultiple } from '../../subscription/subscribe'

/**
 * add state on compNode
 * @param {import('../../types').compNode} parentCompNode
 * @param {import('../../types').compNode} compNode
 * @param {import('../../types').attribute} attribute
 */
const addState = (parentCompNode, compNode, attribute) => {
  const [{ getValue, deps }, name] = attribute

  const update = () => {
    compNode.$[name] = getValue(parentCompNode)
  }

  update()
  subscribeMultiple(compNode, deps, update, BEFORE_DOM_BATCH)
}

export default addState
