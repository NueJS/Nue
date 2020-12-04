import slice from '../slice/slice.js'
import add_slice_dependency from '../slice/add_slice_dependency.js'
import { memoize_cb } from '../callbacks.js'
import split from '../string/split.js'

// create text node with given key as its dependency on $
function createReactiveTextNode (path, value) {
  const textNode = document.createTextNode(value)

  const cb = () => {
    textNode.textContent = slice(this.$, path)
    // console.log('DOM: update text to ', textNode.textContent)
    // if (window.supersweet.showUpdates) window.supersweet.nodeUpdated(textNode)
  }

  textNode.addStateListener = () => {
    textNode.textContent = slice(this.$, path)
    textNode.removeStateListener = add_slice_dependency.call(this, path, memoize_cb.call(this, cb, 'dom'))
  }

  textNode.addStateListener()

  return textNode
}

function processTextContent (element) {
  // console.log({ element })
  const textArray = split.call(this, element.textContent)
  const textNodes = []
  textArray.forEach(t => {
    if (t.isVariable) {
      const element = createReactiveTextNode.call(this, t.path, t.value)
      textNodes.push(element)
    } else {
      textNodes.push(document.createTextNode(t.string))
    }
  })

  if (element.nodeName === '#text') {
    textNodes.forEach(n => element.before(n))
    element.remove()
  } else {
    element.innerHTML = ''
    textNodes.forEach(n => element.append(n))
  }
}

export default processTextContent
