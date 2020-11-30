import getSlice from '../value.js'
import addContextDependency from '../context.js'
import onStateChange from '../reactivity/onStateChange.js'
import { splitText } from '../str.js'

// create text node with given key as its dependency on state
function createReactiveTextNode (key) {
  const stateChain = key.split('.')
  const value = getSlice(this.state, stateChain)
  const textNode = document.createTextNode(value)

  const cb = () => {
    textNode.textContent = getSlice(this.state, stateChain)
    if (window.supersweet.showUpdates) window.supersweet.nodeUpdated(textNode)
  }

  textNode.addStateListener = () => {
    textNode.textContent = getSlice(this.state, stateChain)
    textNode.removeStateListener = onStateChange.call(this, stateChain, cb)
  }

  textNode.addStateListener()

  // if (chain[0] === 'state') {

  // }

  // else {
  //   addContextDependency(textNode, {
  //     type: 'text',
  //     key
  //   })
  // }

  return textNode
}

function processTextContent (element) {
  const textArray = splitText.call(this, element.textContent)
  const textNodes = []
  textArray.forEach(t => {
    if (t.isVariable) {
      const element = createReactiveTextNode.call(this, t.string)
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
