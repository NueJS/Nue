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

    // CONDITIONAL: disabled:if='{{ disabled }}'
    else if (attributeName.endsWith(':if')) {
      name = attributeName.slice(0, -3)
      type = CONDITIONAL
    }

    else if (variableValue) {
      // BIND: :value='{{ count }}'
      if (attributeName[0] === ':') {
        type = BIND
        name = attributeName.slice(1)
      }

      // NORMAL: data-count='{{ count }}'
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
    if (!node.sweet) node.sweet = {}
    node.sweet.attributes = attributes
  }
}

export default parseAttributes
