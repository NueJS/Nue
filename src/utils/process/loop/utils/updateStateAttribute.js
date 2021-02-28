const updateStateAttribute = (nue, component, attribute, closure) => {
  const [propValue, propName] = attribute
  component.nue.$[propName] = propValue.getValue(nue, closure)
}

export default updateStateAttribute
