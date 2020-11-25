export function addProps (node, name, value) {
  if (!node.props) node.props = {}
  node.props[name] = value
  node.removeAttribute(name)
}
