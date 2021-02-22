import { isBracketed } from '../string/bracket.js'
import processPlaceholder from '../string/placeholder/processPlaceholder.js'
import { STATE, EVENT, BIND, NORMAL, CONDITIONAL } from '../constants.js'
import isComp from '../node/isComp.js'

function parseAttributes (nue, node) {
  const attributes = []
  const nodeIsComp = isComp(node)

  for (const attributeName of node.getAttributeNames()) {
    const attributeValue = node.getAttribute(attributeName)
    const variableValue = isBracketed(attributeValue)

    let name, type, placeholder
    const firstChar = attributeName[0]

    // EVENT: @click='increment'
    if (firstChar === '@') {
      type = EVENT
      name = attributeName.slice(1)
      placeholder = {
        fnName: attributeValue
      }
    }

    else if (variableValue) {
      // disabled:if=[disabled]
      if (attributeName.endsWith(':if')) {
        type = CONDITIONAL
        name = attributeName.slice(0, -3)
      }

      // :value=[count], :index=[i]
      else if (firstChar === ':') {
        type = BIND
        name = attributeName.slice(1)
      }

      // class=[foo]
      else {
        name = attributeName
        type = nodeIsComp ? STATE : NORMAL
      }

      placeholder = processPlaceholder(attributeValue)
    }

    if (placeholder) {
      attributes.push({ name, type, placeholder })
      node.removeAttribute(attributeName)
    }
  }

  // if placeholder attributes found
  if (attributes.length) {
    if (!node.parsed) node.parsed = {}
    node.parsed.attributes = attributes
  }
}

export default parseAttributes
