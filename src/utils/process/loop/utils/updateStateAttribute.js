import { STATE } from '../../../constants'
import { setAttr } from '../../../node/dom'

const updateStateAttribute = (compNode, loopedCompNode, attribute, closure) => {
  const [propValue, propName, type] = attribute
  const value = propValue.getValue(compNode, closure)
  if (type === STATE) loopedCompNode.$[propName] = value
  else setAttr(loopedCompNode, propName, value) // type === NORMAL
}

export default updateStateAttribute
