import { errors } from '../dev/errors/index.js'
import { attributeTypes } from '../enums'
import { conditionAttributes, loopAttributes, otherAttributes } from '../constants'
import { isBracketed } from '../string/bracket.js'
import { processPlaceholder } from '../string/placeholder/processPlaceholder.js'
import { dashCaseToCamelCase } from '../string/case.js'
import { getAttr, removeAttr } from '../dom/attributes.js'

const { _normal, _ref, _bindProp, _conditional, _prop, _functional, _state, _staticState, _event } = attributeTypes

/**
 * parse attributes on element if any
 * @param {Parsed_HTMLElement} element
 * @param {string} targetCompName
 */
export const parseAttributes = (element, targetCompName) => {

  // throw error if component specific attributes are used on non-component elements
  if (_DEV_ && !targetCompName) {
    testForCompAttributesUsage(element, targetCompName)
  }

  /** @type {Attribute_ParseInfo[] } */
  const attributes = []
  const elementIsComp = !!targetCompName

  for (const attributeName of element.getAttributeNames()) {
    const attributeValue = /** @type {string} */ (element.getAttribute(attributeName))
    const variableValue = isBracketed(attributeValue)

    let name = attributeName

    /**  @type {AttributeType} */
    let type = _normal
    let value
    const firstChar = attributeName[0]

    if (attributeName === otherAttributes._ref) {
      type = _ref
      value = attributeValue
    }

    // SETTING FN OF COMPONENT
    else if (attributeName.startsWith('fn.')) {
      if (!elementIsComp) continue
      type = _functional
      name = attributeName.slice(3)
      value = attributeValue
    }

    // SETTING STATE OF COMPONENT
    else if (attributeName.startsWith('$.')) {
      if (!elementIsComp) continue
      name = attributeName.slice(2)

      if (variableValue) {
        type = _state
        value = processPlaceholder(attributeValue)
      } else {
        type = _staticState
        value = attributeValue
      }
    }

    // ATTACHING EVENT OR ACTION
    else if (firstChar === '@') {
      type = _event
      name = attributeName.slice(1)
      value = attributeValue
    }

    // attributes that require variable value
    else if (variableValue) {
      // conditionally setting attribute
      if (attributeName.endsWith(':if')) {
        type = _conditional
        name = attributeName.slice(0, -3)
      }

      // binding property
      else if (attributeName.startsWith('bind:')) {
        type = _bindProp
        name = attributeName.slice(5)
      }

      // property
      else if (firstChar === ':') {
        type = _prop
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

/**
 * parse attributes on element if any
 * @param {Parsed_HTMLElement} element
 * @param {string} targetCompName
 */
const testForCompAttributesUsage = (element, targetCompName) => {
  const { _if, _else, _elseIf } = conditionAttributes
  const { _for, _key } = loopAttributes
  const compOnlyAttributes = [_if, _else, _elseIf, _key, _for]

  compOnlyAttributes.forEach(attrName => {
    if (getAttr(element, attrName)) {
      throw errors.component_attribute_used_on_non_component(element, attrName, targetCompName)
    }
  })
}
