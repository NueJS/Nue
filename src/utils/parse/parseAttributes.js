
import { isBracketed } from '../string/bracket.js'
import { processPlaceholder } from '../string/placeholder/processPlaceholder.js'
import { getAttr, removeAttr, dashCaseToCamelCase } from '../node/dom.js'
import { errors } from '../dev/errors.js'
import { attributeTypes } from '../../enums'
import { conditionAttributes, loopAttributes } from '../../constants'

/**
 * parse attributes on element if any
 * @param {Parsed_HTMLElement} element
 * @param {string} compName
 * @param {Comp} comp
 */
export const parseAttributes = (element, compName, comp) => {
  // if component specific attributes are used on non-component elements
  if (_DEV_ && !compName) {
    // DEV ONLy
    const { _if, _else, _elseIf } = conditionAttributes
    const { _for, _ref } = loopAttributes
    const compOnlyAttributes = [_if, _else, _elseIf, _ref, _for]

    compOnlyAttributes.forEach(attrName => {
      if (getAttr(element, attrName)) {
        throw errors.RESERVED_ATTRIBUTE_USED_ON_NON_COMPONENT(comp._compFnName, element, attrName)
      }
    })
  }

  /** @type {Attribute_ParseInfo[] } */
  const attributes = []
  const elementIsComp = !!compName

  for (const attributeName of element.getAttributeNames()) {
    const attributeValue = /** @type {string} */ (element.getAttribute(attributeName))
    const variableValue = isBracketed(attributeValue)

    let name = attributeName

    /**  @type {AttributeType} */
    let type = attributeTypes._normal
    let value
    const firstChar = attributeName[0]

    if (attributeName === loopAttributes._ref) {
      type = attributeTypes._ref
      value = attributeValue
    }

    // SETTING FN OF COMPONENT
    else if (attributeName.startsWith('fn.')) {
      if (!elementIsComp) continue
      type = attributeTypes._functional
      name = attributeName.slice(3)
      value = attributeValue
    }

    // SETTING STATE OF COMPONENT
    else if (attributeName.startsWith('$.')) {
      if (!elementIsComp) continue
      name = attributeName.slice(2)

      if (variableValue) {
        type = attributeTypes._state
        value = processPlaceholder(attributeValue)
      } else {
        type = attributeTypes._staticState
        value = attributeValue
      }
    }

    // ATTACHING EVENT OR ACTION
    else if (firstChar === '@') {
      type = attributeTypes._event
      name = attributeName.slice(1)
      value = attributeValue
    }

    // attributes that require variable value
    else if (variableValue) {
      // conditionally setting attribute
      if (attributeName.endsWith(':if')) {
        type = attributeTypes._conditional
        name = attributeName.slice(0, -3)
      }

      // binding property
      else if (firstChar === ':') {
        type = attributeTypes._prop
        name = attributeName.slice(1)
      }

      value = processPlaceholder(attributeValue)
    }

    if (value) {
      let camelCaseName = name

      if (name.includes('-')) camelCaseName = dashCaseToCamelCase(name)
      // saving to array instead of object for better minification

      attributes.push({
        _name: camelCaseName,
        _placeholder: value,
        _type: type
      })
      removeAttr(element, attributeName)
    }
  }

  // if value attributes found
  if (attributes.length) {
    if (!element._parsedInfo) {
      // @ts-expect-error
      element._parsedInfo = {}
    }
    element._parsedInfo._attributes = attributes
  }
}
