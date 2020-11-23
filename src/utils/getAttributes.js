// return node.attributes in object format
function getAttributes (node) {
  const attributes = {}
  for (let i = 0; i < node.attributes.length; i++) {
    const name = node.attributes[i].name
    const value = node.attributes[i].value
    attributes[name] = value
  }

  return attributes
}

export default getAttributes
