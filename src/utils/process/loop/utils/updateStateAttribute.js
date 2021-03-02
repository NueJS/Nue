import { STATE } from '../../../constants'

const updateStateAttribute = (nue, component, attribute, closure) => {
  const [propValue, propName, type] = attribute
  const value = propValue.getValue(nue, closure)
  if (type === STATE) component.nue.$[propName] = value
  else component.setAttribute(propName, value) // type === NORMAL
}

export default updateStateAttribute
