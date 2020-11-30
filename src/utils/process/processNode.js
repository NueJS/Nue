import processTextContent from './processTextContent.js'
import processAttributes from './processAttributes.js'
import commentIf from './commentIf.js'

/**
 * process node
 * @param {import('../../typedefs.js').SweetNode} node - node to be processed
 * @param {Object} context
 */

function processNode (node, context) {
  // ignore if the node is processed
  if (node.processed) return
  node.processed = true

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

  // add sweetuid to get info from config.templateInfo
  node.sweetuid = node.dataset.sweetuid
  node.removeAttribute('data-sweetuid')

  processAttributes.call(this, node, context)
  if (node.hasChildNodes()) [...node.childNodes].forEach(n => processNode.call(this, n, context))
  else processTextContent.call(this, node, context)
}

export default processNode
