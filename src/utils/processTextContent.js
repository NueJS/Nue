import getSlice from './getSlice.js'

// replace placeholder in textContent of node to state's content
// setup binding to update the content when the state is changed
function processTextContent (node, source = this.state, bind = true) {
  const textNodes = []
  const text = node.textContent
  let openBracketFound = false
  let acc = ''

  // iterate over textContent one character at a time
  for (let i = 0; i < text.length; i++) {
    if (openBracketFound && text[i] !== '}') acc += text[i]
    else if (text[i] === '{') {
      if (acc) {
        textNodes.push(document.createTextNode(acc))
        acc = ''
      }
      openBracketFound = true
    }

    // everything in between {} is variable
    else if (openBracketFound && text[i] === '}') {
      openBracketFound = false

      const varValue = getSlice(source, acc)
      const textNode = document.createTextNode(varValue)
      if (bind) this.bindTextContent(textNode, acc)
      textNodes.push(textNode)
      acc = '' // reset accumulator
    } else {
      acc += text[i]
    }
  }

  if (acc) textNodes.push(document.createTextNode(acc))
  node.textContent = ''
  if (node.nodeName === '#text') textNodes.forEach(n => node.before(n))
  else textNodes.forEach(n => node.append(n))
}
export default processTextContent
