import { isCurled, uncurl } from './str.js'

// returns an object of arrays
// example
// { id: ['cool', false], ':count': ['state.count', true]}

function attrs (node) {
  const attributes = {}
  for (let i = 0; i < node.attributes.length; i++) {
    const attribute = node.attributes[i]
    let value = attribute.value
    const isVariable = isCurled(value)
    if (isVariable) value = uncurl(value)
    attributes[attribute.name] = [value, isVariable]
  }

  return attributes
}

export default attrs
