import slice from '../slice/slice.js'
import add_slice_dependency from '../slice/add_slice_dependency.js'
import { memoize_cb } from '../callbacks.js'
import settings from '../../settings.js'

// create text node with given key as its dependency on $
function placeholder_text_node (path, value) {
  // console.log(path, 'deps on')
  const textNode = document.createTextNode(value)

  const cb = () => {
    textNode.textContent = slice(this.$, path)
    if (settings.showUpdates) settings.onNodeUpdate(textNode)
  }

  textNode.addStateListener = () => {
    textNode.textContent = slice(this.$, path)
    textNode.removeStateListener = add_slice_dependency.call(this, path, memoize_cb.call(this, cb, 'dom'))
  }

  textNode.addStateListener()

  return textNode
}

function placeholder_text_node_from_context (path, value) {
  const textNode = document.createTextNode(value)

  // const cb = () => {
  //   textNode.textContent = slice(this.$, path)
  //   if (settings.showUpdates) settings.onNodeUpdate(textNode)
  // }

  // textNode.addStateListener = () => {
  //   textNode.textContent = slice(this.$, path)
  //   textNode.removeStateListener = add_slice_dependency.call(this, path, memoize_cb.call(this, cb, 'dom'))
  // }

  // textNode.addStateListener()

  return textNode
}

// @todo move this processing step from process node to in process template
function processTextContent (element, memo, context) {
  // console.log({ memo, type: element.nodeName, context })
  // console.log(element.textContent, this.memo_id)
  const parts = memo.parts
  const text_nodes = []
  let prev_node_is_text_node = true

  // if the previous node is text node, join the string - don't create a new text node
  // if not, create next text node
  const add_text_node = (t) => {
    if (text_nodes.length && prev_node_is_text_node) {
      const prev_node = text_nodes[text_nodes.length - 1]
      prev_node.textContent += t.string
    } else {
      text_nodes.push(document.createTextNode(t.string))
    }
  }

  parts.forEach(t => {
    // function
    if (t.fn_name) {
      const textNode = document.createTextNode('')
      text_nodes.push(textNode)

      const set_text = () => {
        textNode.textContent = t.call_fn.call(this)
      }

      set_text()
      this.on.reactiveUpdate(set_text, t.deps_joined)
    }
    else if (!t.path) add_text_node(t)
    else {
      // get the value from path, to check if the placeholder is valid or not
      // path is invalid if slice() throws
      // if path is invalid don't treat the string as placeholder
      // even if slice does not throw and value is undefined, path is still not valid
      let value, is_from_context
      try {
        value = slice(this.$, t.path)
        if (value === undefined) {
          // console.log('try finding ', t.path, 'in ', context, 'is :', slice(context, t.path))
          value = slice(context, t.path)
          is_from_context = true
        }
      } catch { /**/ }

      if (value === undefined) add_text_node(t)
      else {
        const path = is_from_context ? context.path : t.path
        const node = placeholder_text_node.call(this, path, value)
        text_nodes.push(node)
        prev_node_is_text_node = false
      }
    }
  })

  // if node is text content, replace new text nodes with this current one
  if (element.nodeName === Node.TEXT_NODE) {
    text_nodes.forEach(n => element.before(n))
    element.remove()
  }

  else {
    element.innerHTML = ''
    text_nodes.forEach(n => element.append(n))
  }
}

export default processTextContent
