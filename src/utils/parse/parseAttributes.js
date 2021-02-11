import { isBracketed } from '../string/bracket.js'
import processPlaceholder from '../string/placeholder/processPlaceholder.js'
import { STATE, EVENT, BIND, NORMAL, FN_PROP, CONDITIONAL } from '../constants.js'
import isComp from '../node/isComp.js'

function parseAttributes (comp, node) {
  const attributes = []
  const isSweetComp = isComp(node)

  for (const attributeName of node.getAttributeNames()) {
    // get the attribute string value
    const attributeValue = node.getAttribute(attributeName)
    // check if the value is variable or not
    const variableValue = isBracketed(attributeValue)

    let name, type, placeholder

    // EVENT: @click='increment'
    if (attributeName[0] === '@') {
      type = isSweetComp ? FN_PROP : EVENT
      name = attributeName.slice(1)
      placeholder = {
        fnName: attributeValue
      }
    }

    else if (variableValue) {
      // CONDITIONAL: disabled:if=[disabled]
      if (attributeName.endsWith(':if')) {
        type = CONDITIONAL
        name = attributeName.slice(0, -3)
      }

      // BIND: :value=[count],  :index=[i]
      else if (attributeName[0] === ':') {
        type = BIND
        name = attributeName.slice(1)
      }

      // NORMAL: class=[foo]
      else {
        name = attributeName
        type = isSweetComp ? STATE : NORMAL
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
