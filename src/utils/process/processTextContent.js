import getSlice from '../value.js'
// import addContextDependency from '../context.js'
import onStateChange from '../reactivity/onStateChange.js'
import { callCbOnce } from '../reactivity/cbs.js'
import { splitText } from '../str.js'

// create text node with given key as its dependency on $
function createReactiveTextNode (path, value) {
  // const value = getSlice(this.$, path)
  // if (value === undefined) throw new Error('placeholder is not a variable')
  const textNode = document.createTextNode(value)

  const cb = () => {
    textNode.textContent = getSlice(this.$, path)
    console.log('DOM: update text to ', textNode.textContent)
    // if (window.supersweet.showUpdates) window.supersweet.nodeUpdated(textNode)
  }

  textNode.addStateListener = () => {
    textNode.textContent = getSlice(this.$, path)
    textNode.removeStateListener = onStateChange.call(this, path, callCbOnce.call(this, cb, 'dom'))
  }

  textNode.addStateListener()

  return textNode
}

function processTextContent (element) {
  // console.log({ element })
  const textArray = splitText.call(this, element.textContent)
  const textNodes = []
  textArray.forEach(t => {
    if (t.isVariable) {
      // const path = t.string.split('.')
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
