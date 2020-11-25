import getSlice from './getSlice.js'

// replace placeholder in textContent of node to state's content
// setup binding to update the content when the state is changed
function processTextContent (node, source = {}) {
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
    } else if (openBracketFound && text[i] === '}') {
      // everything in between {} is variable
      openBracketFound = false
      let fromSource = false
      let varValue

      try {
        varValue = getSlice(this.state, acc)
        if (varValue !== undefined) { fromSource = true }
      } catch {

      }
      if (!fromSource) {
        varValue = getSlice(source, acc)
      }

      const textNode = document.createTextNode(varValue)
      textNodes.push(textNode)
      acc = '' // reset accumulator

      if (fromSource) {
        if (!node.mapArrayUsage) node.mapArrayUsage = []
        node.mapArrayUsage.push({
          type: 'text',
          key: acc,
          node: textNode
        })
      } else this.bindTextContent(textNode, acc)
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
