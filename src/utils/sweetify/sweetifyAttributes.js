// import { uid } from '../others.js'
import { isBracketed, unBracket, process_placeholder } from '../string/placeholder.js'
import { STATE, EVENT, BIND, NORMAL, FN_PROP } from '../constants.js'
// import { components } from '../../index.js'

function sweetifyAttributes (element) {
  const attributes = []

  // loop over each attribute
  for (const attribute_name of element.getAttributeNames()) {
    //
    const attribute_value = element.getAttribute(attribute_name)
    let is_placeholder = isBracketed(attribute_value)
    let name, type, placeholder

    let placeholder_text = attribute_value

    // handle Shorthand
    if (attribute_value === '' && isBracketed(attribute_name)) {
      name = unBracket(attribute_name)
      placeholder_text = attribute_name
      is_placeholder = true
      type = element.sweet && element.sweet.isSweet ? STATE : NORMAL
    }

    else if (is_placeholder) {
      // EVENT @event-name=[handler]
      if (attribute_name[0] === '@') {
        // console.log({ sweet: element.sweet })
        type = element.sweet && element.sweet.isSweet ? FN_PROP : EVENT
        name = attribute_name.substr(1)
      }

      // BIND :prop=[path]
      else if (attribute_name[0] === ':') {
        type = BIND
        name = attribute_name.substr(1)
      }

      // NORMAL name=[path]
      else {
        name = attribute_name
        type = element.sweet && element.sweet.isSweet ? STATE : NORMAL
      }
    }

    if (is_placeholder) {
      placeholder = process_placeholder.call(this, placeholder_text)
      element.removeAttribute(attribute_name)
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
