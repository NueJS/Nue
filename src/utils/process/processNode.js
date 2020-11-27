import processTextContent from './processTextContent.js'
// import processMapping from './processMapping.js'
import processIf from './processIf.js'
import processAttributes from './processAttributes.js'

function processNode (node, context) {
  if (node.nodeName === 'STYLE') return

  if (node.nodeName === '#text') {
    processTextContent.call(this, node, context)
    return
  }

  if (node.nodeName === 'TEMPLATE') {
    // processMapping.call(this, node, context)
    processIf.call(this, node, context)
    return
  }

  processAttributes.call(this, node, context)
  if (node.childNodes.length > 1) [...node.childNodes].forEach(n => processNode.call(this, n, context))
  else processTextContent.call(this, node, context)
}

export default processNode
