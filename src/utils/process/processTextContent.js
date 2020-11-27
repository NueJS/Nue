import getValue, { getSlice } from '../value.js'
import addContextDependency from '../context.js'
import onStateChange from '../state/onStateChange.js'

function processTextContent (node, context) {
  const textNodes = []
  const text = node.textContent

  let openBracketFound = false
  let str = ''
  for (let i = 0; i < text.length; i++) {
    if (openBracketFound && text[i] !== '}') str += text[i]
    else if (text[i] === '{') {
      openBracketFound = true
      if (str) {
        // create text node for all string before the variable
        textNodes.push(document.createTextNode(str))
        str = ''
      }
    } else if (openBracketFound && text[i] === '}') {
      // treat everything in between {} as variable
      const chain = str.split('.')
      const [value, isStateKey] = getValue.call(this, chain, context)
      const textNode = document.createTextNode(value)
      textNodes.push(textNode)

      if (isStateKey) {
        onStateChange.call(this, chain, () => {
          textNode.textContent = getSlice.call(this, chain)
        })
      } else {
        addContextDependency(textNode, {
          type: 'text',
          key: str
        })
      }

      openBracketFound = false
      str = '' // reset accumulator
    } else {
      str += text[i]
    }
  }

  if (str) textNodes.push(document.createTextNode(str))

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
