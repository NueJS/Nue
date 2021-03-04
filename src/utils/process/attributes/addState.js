import { BEFORE_DOM_BATCH } from '../../constants'
import { subscribeMultiple } from '../../subscription/subscribe'

const addState = (compNode, node, attribute) => {
  const [{ getValue, deps }, name] = attribute

  const update = () => {
    compNode.$[name] = getValue(compNode)
  }

  update()
  subscribeMultiple(compNode, deps, update, BEFORE_DOM_BATCH)
}

export default addState
