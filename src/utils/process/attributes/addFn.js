const addFn = (compNode, node, [value, name]) => {
  compNode.fn[name] = compNode.closure.fn[value]
}

export default addFn
