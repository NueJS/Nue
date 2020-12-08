import slice from '../slice/slice.js'
import add_slice_dependency from '../slice/add_slice_dependency.js'
import { memoize_cb } from '../callbacks.js'
import settings from '../../settings.js'
import { FN, REACTIVE, TEXT } from '../constants.js'
import { add_connects } from '../node/connections.js'

// @todo move this processing step from process node to in process template
function process_text_node (text_node) {
  const parts = this.memo_of(text_node).parts
  const text_nodes = []
  let prev_node_is_text_node = true

  // if the previous node is text node
  // join the string - don't create a new text node
  const add_text_node = (text) => {
    if (text_nodes.length && prev_node_is_text_node) {
      const prev_node = text_nodes[text_nodes.length - 1]
      prev_node.textContent += text
    } else {
      text_nodes.push(document.createTextNode(text))
    }
  }

  parts.forEach(part => {
    const { type, get_value, path, text, content, deps } = part

    if (type === TEXT) add_text_node(text)

    else if (type === REACTIVE) {
      let value
      try { value = get_value() } catch { /**/ }
      if (value === undefined) add_text_node('[' + content + ']')
      else {
        const textNode = document.createTextNode(value)

        const cb = () => {
          textNode.textContent = slice(this.$, path)
          if (settings.showUpdates) settings.onNodeUpdate(textNode)
        }

        add_connects(textNode, () => this.on.domUpdate(cb, deps))
        text_nodes.push(textNode)
        prev_node_is_text_node = false
      }
    }

    else if (part.type === FN) {
      prev_node_is_text_node = false
      const node = document.createTextNode('')
      const update = () => {
        if (settings.showUpdates) settings.onNodeUpdate(node)
        node.textContent = part.get_value()
      }
      update()
      add_connects(node, () => this.on.domUpdate(update, deps))
      text_nodes.push(node)
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
