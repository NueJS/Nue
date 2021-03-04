const addStaticState = (compNode, node, [value, name]) => {
  compNode.$[name] = value
}

export default addStaticState
