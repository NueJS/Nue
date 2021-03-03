import { isBracketed } from '../string/bracket.js'
import processPlaceholder from '../string/placeholder/processPlaceholder.js'
import { STATE, EVENT, BIND, NORMAL, CONDITIONAL, STATIC_STATE, FUNCTION_ATTRIBUTE, REF, REF_ATTRIBUTE, PARSED } from '../constants.js'
import isComp from '../node/isComp.js'
import { removeAttr } from '../node/dom.js'

const parseAttributes = (node) => {
  const attributes = []
  const nodeIsComp = isComp(node)

  for (const attributeName of node.getAttributeNames()) {
    const attributeValue = node.getAttribute(attributeName)
    const variableValue = isBracketed(attributeValue)

    let name, type, value
    const firstChar = attributeName[0]

    if (attributeName === REF_ATTRIBUTE) {
      type = REF
      name = attributeName
      value = attributeValue
    }

    // SETTING FN OF COMPONENT
    else if (attributeName.startsWith('fn.')) {
      if (!nodeIsComp) continue
      type = FUNCTION_ATTRIBUTE
      name = attributeName.slice(3)
      value = attributeValue
    }

    // SETTING STATE OF COMPONENT
    else if (attributeName.startsWith('$.')) {
      if (!nodeIsComp) continue
      name = attributeName.slice(2)
      if (variableValue) {
        type = STATE
        value = processPlaceholder(attributeValue)
      } else {
        type = STATIC_STATE
        value = attributeValue
      }
    }

    // ATTACHING EVENT OR ACTION
    else if (firstChar === '@') {
      type = EVENT
      name = attributeName.slice(1)
      value = attributeValue
    }

    // attributes that require variable value
    else if (variableValue) {
      // conditionally setting attribute
      if (attributeName.endsWith(':if')) {
        type = CONDITIONAL
        name = attributeName.slice(0, -3)
      }

      // binding property
      else if (firstChar === ':') {
        type = BIND
        name = attributeName.slice(1)
      }

      // normal attribute
      else {
        name = attributeName
        type = NORMAL
      }

      value = processPlaceholder(attributeValue)
    }

    if (value) {
      // saving to array instead of object for better minification
      attributes.push([value, name, type])
      removeAttr(node, attributeName)
    }
  }

  // if value attributes found
  if (attributes.length) {
    if (!node[PARSED]) node[PARSED] = {}
    node[PARSED].attributes = attributes
  }
}

export default parseAttributes
