import { BEFORE_DOM_BATCH, INIT_$ } from '../../constants'
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
    if (compNode === parentCompNode) compNode.$[name] = getValue(parentCompNode)
    else {
      if (!compNode[INIT_$]) compNode[INIT_$] = {}
      compNode[INIT_$][name] = getValue(parentCompNode)
    }
  }

  update()
  subscribeMultiple(parentCompNode, deps, update, BEFORE_DOM_BATCH)
}

export default addState
