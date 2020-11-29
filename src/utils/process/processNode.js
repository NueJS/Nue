import processTextContent from './processTextContent.js'
import processAttributes from './processAttributes.js'
import commentIf from './commentIf.js'

function processNode (node, context) {
  // ignore if the node is processed
  if (node.processed) return
  node.processed = true

  // add sweetuid to get info from config.templateInfo
  node.sweetuid = node.dataset.sweetuid
  node.removeAttribute('data-sweetuid')

  // ignore style node
  if (node.nodeName === 'STYLE') return

  if (node.nodeName === '#comment') {
    const commentSplit = node.textContent.trim().split(' ')
    if (commentSplit[0] === 'if') {
      commentIf.call(this, node, commentSplit)
    }
    return
  }

  if (node.nodeName === '#text') {
    processTextContent.call(this, node, context)
    return
  }

  processAttributes.call(this, node, context)
  if (node.childNodes.length > 1) [...node.childNodes].forEach(n => processNode.call(this, n, context))
  else processTextContent.call(this, node, context)
}

export default processNode
