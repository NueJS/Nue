// import { uid } from '../others.js'
import { is_placeholder, unwrap, process_placeholder } from '../string/placeholder.js'
import { STATE, REACTIVE, FN, SHORTHAND, EVENT, BIND, NORMAL } from '../constants.js'

function memoize_attributes (element, memo_id) {
  console.log(element.nodeName, memo_id)
  const node_memo = this.memo.nodes[memo_id] = { attributes: [] }

  // loop over each attribute
  for (const attribute_name of element.getAttributeNames()) {
    //
    const attribute_value = element.getAttribute(attribute_name)
    let is_var = is_placeholder(attribute_value)

    let name, type, path, content, fn_info

    if (is_var) {
      const info = process_placeholder(attribute_value)
      if (info.type === REACTIVE) {
        path = info.value
        content = info.content
      } else if (info.type === FN) {
        fn_info = info
      }
    }

    // [path]
    if (attribute_value === '' && is_placeholder(attribute_name)) {
      type = SHORTHAND
      name = unwrap(attribute_name)
      is_var = true
    }

    // :prop=[path] or :prop='value'
    else if (attribute_name[0] === ':') {
      type = STATE
      name = attribute_name.substr(1)
    }

    else if (is_var) {
      // @event-name=[handler]
      if (attribute_name[0] === '@') {
        type = EVENT
        name = attribute_name.substr(1)
      }

      // bind:prop=[path]
      else if (attribute_name.startsWith('bind:')) {
        type = BIND
        name = attribute_name.substr(5)
      }

      // name=[path]
      else {
        type = NORMAL
        name = attribute_name
      }
    }

    if (is_var) element.removeAttribute(attribute_name)
    if (name) node_memo.attributes.push({ path, name, type, content, is_placeholder: is_var, fn_info })
  }
}

export default memoize_attributes
