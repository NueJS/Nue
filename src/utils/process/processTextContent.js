import getSlice from '../value.js'
import addContextDependency from '../context.js'
import onStateChange from '../state/onStateChange.js'
import splitText from '../str.js'

function createReactiveTextNode (str, state) {
  const chain = str.split('.')
  const stateChain = chain.slice(1)
  const value = getSlice(state, stateChain)
  const textNode = document.createTextNode(value)

  if (chain[0] === 'state') {
    onStateChange.call(this, chain, () => {
      textNode.textContent = getSlice(state, stateChain)
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
  const strings = splitText(node.textContent)
  const textNodes = []
  strings.forEach(str => {
    if (str.isVariable) {
      const textNode = createReactiveTextNode.call(str, this.state)
      textNodes.push(textNode)
    } else {
      textNodes.push(document.createTextNode(str))
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
