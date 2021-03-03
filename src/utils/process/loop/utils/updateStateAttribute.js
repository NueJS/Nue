import { STATE } from '../../../constants'

const updateStateAttribute = (compNode, loopedCompNode, attribute, closure) => {
  const [propValue, propName, type] = attribute
  const value = propValue.getValue(compNode, closure)
  if (type === STATE) loopedCompNode.$[propName] = value
  else loopedCompNode.setAttribute(propName, value) // type === NORMAL
}

export default updateStateAttribute
