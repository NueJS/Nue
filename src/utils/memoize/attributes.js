// import { uid } from '../others.js'
import { is_placeholder, unwrap, process_placeholder } from '../string/placeholder.js'
import { attribute_type, placeholder_type } from '../constants.js'

function memoize_attributes (element, memo_id) {
  // console.log(element.nodeName, memo_id)
  const node_memo = this.memo.nodes[memo_id] = { attributes: [] }

  // loop over each attribute
  for (const attribute_name of element.getAttributeNames()) {
    // console.log('attribute name is ', attribute_name)
    //
    const attribute_value = element.getAttribute(attribute_name)
    let is_ph = is_placeholder(attribute_value)
    const info = process_placeholder(attribute_value)

    let name, type, path, content, fn_info
    if (info.type === placeholder_type.REACTIVE) {
      path = info.value
      content = info.content
    } else {
      fn_info = info
    }

    // [path]
    if (attribute_value === '' && is_placeholder(attribute_name)) {
      type = attribute_type.SHORTHAND
      name = unwrap(attribute_name)
      is_ph = true
    }

    // :prop=[path] or :prop='value'
    else if (attribute_name[0] === ':') {
      type = attribute_type.STATE
      name = attribute_name.substr(1)
    }

    else if (is_ph) {
      // @event-name=[handler]
      if (attribute_name[0] === '@') {
        type = attribute_type.EVENT
        name = attribute_name.substr(1)
      }

      // bind:prop=[path]
      else if (attribute_name.startsWith('bind:')) {
        type = attribute_type.BIND
        name = attribute_name.substr(5)
      }

      // name=[path]
      else {
        type = attribute_type.NORMAL
        name = attribute_name
      }
    }

    if (is_ph) element.removeAttribute(attribute_name)
    if (name) node_memo.attributes.push({ path, name, type, content, is_placeholder: is_ph, fn_info })
  }
}

export default memoize_attributes
