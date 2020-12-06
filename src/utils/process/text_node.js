import slice from '../slice/slice.js'
import add_slice_dependency from '../slice/add_slice_dependency.js'
import { memoize_cb } from '../callbacks.js'
import settings from '../../settings.js'
import { FN, REACTIVE, TEXT } from '../constants.js'

// create text node with given key as its dependency on $
function create_reactive_text_node (path, value) {
  const textNode = document.createTextNode(value)

  const cb = () => {
    textNode.textContent = slice(this.$, path)
    if (settings.showUpdates) settings.onNodeUpdate(textNode)
  }

  const mcb = memoize_cb.call(this, cb, 'dom')
  textNode.removeStateListener = add_slice_dependency.call(this, path, mcb)
  return textNode
}

// @todo move this processing step from process node to in process template
function process_text_node (text_node, context) {
  // console.log({ text_node, id: text_node.memo_id, text: text_node.textContent })
  const parts = this.memo_of(text_node).parts
  const text_nodes = []
  let prev_node_is_text_node = true

  // if the previous node is text node, join the string - don't create a new text node
  const add_text_node = (t) => {
    if (text_nodes.length && prev_node_is_text_node) {
      const prev_node = text_nodes[text_nodes.length - 1]
      prev_node.textContent += t.string
    } else {
      text_nodes.push(document.createTextNode(t.string))
    }
  }

  parts.forEach(part => {
    if (part.type === TEXT) add_text_node(part)
    //
    else if (part.type === REACTIVE) {
      // get the value from path, to check if the placeholder is valid or not
      // path is invalid if slice() throws or undefined value is got from slice
      let value
      try { value = slice(this.$, part.path) } catch { /**/ }
      if (value === undefined) add_text_node(part)
      else {
        const node = create_reactive_text_node.call(this, part.path, value)
        text_nodes.push(node)
        prev_node_is_text_node = false
      }
    }
    //
    else if (part.type === FN) {
      const node = document.createTextNode('')
      text_nodes.push(node)
      const update_text_on_change = part.on_args_change(v => {
        node.textContent = v
      })

      update_text_on_change()
      this.on.reactiveUpdate(update_text_on_change, part.deps)
    }
  })

  // if node is text content, replace new text nodes with this current one
  if (text_node.nodeType === Node.TEXT_NODE) {
    text_nodes.forEach(n => text_node.before(n))
    text_node.remove()
  } else {
    text_node.innerHTML = ''
    text_nodes.forEach(n => text_node.append(n))
  }
}

export default process_text_node
