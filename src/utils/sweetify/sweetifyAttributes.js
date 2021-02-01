import { isBracketed } from '../string/bracket.js'
import processPlaceholder from '../string/placeholder/processPlaceholder.js'
import { STATE, EVENT, BIND, NORMAL, FN_PROP, CONDITIONAL } from '../constants.js'
// import { components } from '../../index.js'

const isComp = element => element.sweet && element.sweet.isComp

function sweetifyAttributes (comp, element) {
  const attributes = []
  const isSweetComp = isComp(element)

  for (const attributeName of element.getAttributeNames()) {
    // get the attribute string value
    const attributeValue = element.getAttribute(attributeName)
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
    if (attributeName.endsWith(':if')) {
      name = attributeName.slice(0, -3)
      type = CONDITIONAL
    }

    if (variableValue) {
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
      element.removeAttribute(attributeName)
    }
  }

  // if placeholder attributes found
  if (attributes.length) {
    if (!element.sweet) element.sweet = {}
    element.sweet.attributes = attributes
  }
}

export default sweetifyAttributes
