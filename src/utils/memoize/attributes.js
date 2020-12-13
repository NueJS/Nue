// import { uid } from '../others.js'
import { is_in_brackets, unwrap, process_placeholder } from '../string/placeholder.js'
import { STATE, EVENT, BIND, NORMAL } from '../constants.js'
import { components, render } from '../../index.js'

function memoAttributes (element) {
  element.supersweet.attributes = []

  // loop over each attribute
  for (const attribute_name of element.getAttributeNames()) {
    //
    const attribute_value = element.getAttribute(attribute_name)
    let is_placeholder = is_in_brackets(attribute_value)
    let name, type, placeholder

    const nodeName = element.nodeName.toLowerCase()
    const isSweet = components[nodeName]
    if (isSweet) {
      render(nodeName)
    }

    let placeholder_text = attribute_value

    // handle Shorthand
    if (attribute_value === '' && is_in_brackets(attribute_name)) {
      name = unwrap(attribute_name)
      placeholder_text = attribute_name
      is_placeholder = true
      type = isSweet ? STATE : NORMAL
    }

    else if (is_placeholder) {
      // EVENT @event-name=[handler]
      if (attribute_name[0] === '@') {
        type = EVENT
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
        type = isSweet ? STATE : NORMAL
      }
    }

    if (is_placeholder) {
      placeholder = process_placeholder.call(this, placeholder_text)
      element.removeAttribute(attribute_name)
    }
    if (name) {
      element.supersweet.attributes.push({ name, type, placeholder })
    }
  }
}

export default memoAttributes
