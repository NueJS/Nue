import slice from '../slice/slice.js'
import add_slice_dependency from '../slice/add_slice_dependency.js'
import { memoize_cb } from '../callbacks.js'
import split from '../string/split.js'

// create text node with given key as its dependency on $
function createReactiveTextNode (path, value) {
  const textNode = document.createTextNode(value)

  const cb = () => {
    textNode.textContent = slice(this.$, path)
    // if (window.supersweet.showUpdates) window.supersweet.nodeUpdated(textNode)
  }

  textNode.addStateListener = () => {
    textNode.textContent = slice(this.$, path)
    textNode.removeStateListener = add_slice_dependency.call(this, path, memoize_cb.call(this, cb, 'dom'))
  }

  textNode.addStateListener()

  return textNode
}

// @todo move this processing step from process node to in process template
function processTextContent (element) {
  const textArray = split.call(this, element.textContent)
  const textNodes = []
  textArray.forEach(t => {
    if (t.path) {
      const element = createReactiveTextNode.call(this, t.path, t.value)
      textNodes.push(element)
    } else {
      textNodes.push(document.createTextNode(t.string))
    }
  })

  // if node is text content, replace new text nodes with this current one
  if (element.nodeName === '#text') {
    textNodes.forEach(n => element.before(n))
    element.remove()
  }

  else {
    element.innerHTML = ''
    textNodes.forEach(n => element.append(n))
  }
}

export default processTextContent
