
import { isBracketed } from '../string/bracket.js'
import processPlaceholder from '../string/placeholder/processPlaceholder.js'
import { STATE, EVENT, BIND, NORMAL, CONDITIONAL, STATIC_STATE, FUNCTION_ATTRIBUTE, REF, REF_ATTRIBUTE, PARSED, FOR_ATTRIBUTE, KEY_ATTRIBUTE, IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, ELSE_ATTRIBUTE } from '../constants.js'
import { getAttr, removeAttr, dashCaseToCamelCase } from '../node/dom.js'
import errors from '../dev/errors.js'
import DEV from '../dev/DEV.js'

/**
 * parse attributes on element if any
 * @param {import('../types').parsedElement} element
 * @param {string} compName
 */
const parseAttributes = (element, compName) => {
  // if component specific attributes are used on non-component elements
  if (DEV && !compName) {
    const compOnlyAttributes = [FOR_ATTRIBUTE, KEY_ATTRIBUTE, IF_ATTRIBUTE, ELSE_IF_ATTRIBUTE, ELSE_ATTRIBUTE]
    compOnlyAttributes.forEach(attrName => {
      if (getAttr(element, attrName)) {
        throw errors.RESERVED_ATTRIBUTE_USED_ON_NON_COMPONENT(attrName, element, attrName)
      }
    })
  }

  /** @type {import('../types').attributes} */
  const attributes = []
  const elementIsComp = !!compName

  for (const attributeName of element.getAttributeNames()) {
    const attributeValue = element.getAttribute(attributeName)
    const variableValue = isBracketed(attributeValue)

    let name = attributeName
    let type, value
    const firstChar = attributeName[0]

    if (attributeName === REF_ATTRIBUTE) {
      type = REF
      value = attributeValue
    }

    // SETTING FN OF COMPONENT
    else if (attributeName.startsWith('fn.')) {
      if (!elementIsComp) continue
      type = FUNCTION_ATTRIBUTE
      name = attributeName.slice(3)
      value = attributeValue
    }

    // SETTING STATE OF COMPONENT
    else if (attributeName.startsWith('$.')) {
      if (!elementIsComp) continue
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
        type = NORMAL
      }

      value = processPlaceholder(attributeValue)
    }

    if (value) {
      let camelCaseName = name

      if (name.includes('-')) camelCaseName = dashCaseToCamelCase(name)
      // saving to array instead of object for better minification
      attributes.push([value, camelCaseName, type])
      removeAttr(element, attributeName)
    }
  }

  // if value attributes found
  if (attributes.length) {
    if (!element[PARSED]) element[PARSED] = {}
    element[PARSED].attributes = attributes
  }
}

export default parseAttributes
