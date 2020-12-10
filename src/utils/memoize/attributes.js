// import { uid } from '../others.js'
import { is_in_brackets, unwrap, process_placeholder } from '../string/placeholder.js'
import { STATE, SHORTHAND, EVENT, BIND, NORMAL } from '../constants.js'
import { components } from '../../index.js'

function memoize_attributes (element) {
  this.memo_id++
  // console.log(element.nodeName, this.memo_id)
  const node_memo = this.memo.nodes[this.memo_id] = { attributes: [] }

  // loop over each attribute
  for (const attribute_name of element.getAttributeNames()) {
    //
    const attribute_value = element.getAttribute(attribute_name)
    let is_placeholder = is_in_brackets(attribute_value)
    let name, type, placeholder

    const is_sweet_component = components[element.nodeName.toLowerCase()]
    let placeholder_text = attribute_value

    // debugger
    // SHORTHAND [path]
    if (attribute_value === '' && is_in_brackets(attribute_name)) {
      name = unwrap(attribute_name)
      placeholder_text = attribute_name
      is_placeholder = true
      type = is_sweet_component ? STATE : NORMAL
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
        type = is_sweet_component ? STATE : NORMAL
      }
    }

    if (is_placeholder) {
      placeholder = process_placeholder.call(this, placeholder_text)
      element.removeAttribute(attribute_name)
    }
    if (name) node_memo.attributes.push({ name, type, placeholder })
  }
}

export default memoize_attributes
