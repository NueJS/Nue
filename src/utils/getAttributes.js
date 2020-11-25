import { isCurled, uncurl } from './str.js'

// return node.attributes in object format
function getAttributes (node) {
  const attributes = {}
  for (let i = 0; i < node.attributes.length; i++) {
    const name = node.attributes[i].name
    let value = node.attributes[i].value
    const isVariable = isCurled(value)
    if (isVariable) value = uncurl(value)
    attributes[name] = [value, isVariable]
  }

  return attributes
}

export default getAttributes
