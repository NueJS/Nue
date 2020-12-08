// import { uid } from '../others.js'
import { is_in_brackets, unwrap, process_placeholder } from '../string/placeholder.js'
import { STATE, SHORTHAND, EVENT, BIND, NORMAL } from '../constants.js'

function memoize_attributes (element, memo_id) {
  const node_memo = this.memo.nodes[memo_id] = { attributes: [] }

  // loop over each attribute
  for (const attribute_name of element.getAttributeNames()) {
    //
    const attribute_value = element.getAttribute(attribute_name)
    let is_placeholder = is_in_brackets(attribute_value)
    let name, type, placeholder

    // debugger
    // SHORTHAND [path]
    if (attribute_value === '' && is_in_brackets(attribute_name)) {
      type = SHORTHAND
      name = unwrap(attribute_name)
      is_placeholder = true
    }

    // STATE :prop=[path] or :prop='value'
    else if (attribute_name[0] === ':') {
      type = STATE
      name = attribute_name.substr(1)
    }

    else if (is_placeholder) {
      // EVENT @event-name=[handler]
      if (attribute_name[0] === '@') {
        type = EVENT
        name = attribute_name.substr(1)
      }

      // BIND bind:prop=[path]
      else if (attribute_name.startsWith('bind:')) {
        type = BIND
        name = attribute_name.substr(5)
      }

      // NORMAL name=[path]
      else {
        type = NORMAL
        name = attribute_name
      }
    }

    if (is_placeholder) {
      const placeholder_text = type === SHORTHAND ? attribute_name : attribute_value
      // debugger
      placeholder = process_placeholder.call(this, placeholder_text)
      element.removeAttribute(attribute_name)
    }
    if (name) node_memo.attributes.push({ name, type, placeholder })
    // console.log(element.nodeName, memo_id, node_memo)
  }
}

export default memoize_attributes
