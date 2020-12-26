// :name=[path]
function addState (comp, node, attribute) {
  const { name, placeholder } = attribute
  const { getValue } = placeholder

  // pass the stateProps to child component to initialize state
  if (!node.stateProps) node.stateProps = {}
  node.stateProps[name] = getValue(comp)
}

export default addState
