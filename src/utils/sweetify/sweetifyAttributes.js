// import { uid } from '../others.js'
import { isBracketed, unBracket } from '../string/bracket.js'
import processPlaceholder from '../string/placeholder/processPlaceholder.js'
import { STATE, EVENT, BIND, NORMAL, FN_PROP, CONDITIONAL } from '../constants.js'
// import { components } from '../../index.js'

function sweetifyAttributes (comp, element) {
  const attributes = []

  // loop over each attribute
  for (const attributeName of element.getAttributeNames()) {
    //
    const attributeValue = element.getAttribute(attributeName)
    let isPlaceholder = isBracketed(attributeValue)
    let name, type, placeholder

    let placeholderText = attributeValue

    if (attributeName.endsWith(':if')) {
      name = attributeName.substr(0, attributeName.length - 1 - 2)
      type = CONDITIONAL
    }

    // handle Shorthand
    else if (attributeValue === '' && isBracketed(attributeName)) {
      name = unBracket(attributeName)
      placeholderText = attributeName
      isPlaceholder = true
      type = element.sweet && element.sweet.isComp ? STATE : NORMAL
    }

    else if (isPlaceholder) {
      // EVENT @event-name=[handler]
      if (attributeName[0] === '@') {
        // console.log({ sweet: element.sweet })
        type = element.sweet && element.sweet.isComp ? FN_PROP : EVENT
        name = attributeName.substr(1)
      }

      // BIND :prop=[path]
      else if (attributeName[0] === ':') {
        type = BIND
        name = attributeName.substr(1)
      }

      // NORMAL name=[path]
      else {
        name = attributeName
        type = element.sweet && element.sweet.isComp ? STATE : NORMAL
      }
    }

    if (isPlaceholder) {
      placeholder = processPlaceholder(comp, placeholderText)
      element.removeAttribute(attributeName)
    }
    if (name) {
      attributes.push({ name, type, placeholder })
    }
  }

  if (attributes.length) {
    if (!element.sweet) element.sweet = {}
    element.sweet.attributes = attributes
  }
}

export default sweetifyAttributes
