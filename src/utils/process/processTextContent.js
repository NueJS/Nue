import getValue from '../value.js'
import bindTextContent from '../bind/bindTextContent.js'
import addContextDependency from '../context.js'

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
      const [value, isStateKey] = getValue.call(this, str, context)
      const textNode = document.createTextNode(value)
      textNodes.push(textNode)

      if (isStateKey) {
        bindTextContent.call(this, textNode, str)
      } else {
        addContextDependency.call(this, {
          type: 'text',
          key: str,
          node: textNode
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
