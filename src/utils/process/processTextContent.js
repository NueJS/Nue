import getSlice from '../value.js'
import addContextDependency from '../context.js'
import onStateChange from '../reactivity/onStateChange.js'
import { splitText } from '../str.js'

function createReactiveTextNode (str) {
  const chain = str.split('.')
  const stateChain = chain.slice(1)
  const value = getSlice(this.state, stateChain)
  const textNode = document.createTextNode(value)

  if (chain[0] === 'state') {
    onStateChange.call(this, stateChain, () => {
      textNode.textContent = getSlice(this.state, stateChain)
      if (window.supersweet.showUpdates) window.supersweet.nodeUpdated(textNode)
    })
  }

  else {
    addContextDependency(textNode, {
      type: 'text',
      key: str
    })
  }

  return textNode
}

function processTextContent (node, context) {
  const textArray = splitText(node.textContent)
  const textNodes = []
  textArray.forEach(t => {
    if (t.isVariable) {
      const textNode = createReactiveTextNode.call(this, t.string)
      textNodes.push(textNode)
    } else {
      textNodes.push(document.createTextNode(t.string))
    }
  })

  if (node.nodeName === '#text') {
    textNodes.forEach(n => node.before(n))
    node.remove()
  }

  else {
    node.innerHTML = ''
    textNodes.forEach(n => node.append(n))
  }
}

export default processTextContent
