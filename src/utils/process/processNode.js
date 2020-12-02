import processTextContent from './processTextContent.js'
import processAttributes from './processAttributes.js'
import commentIf from './commentIf.js'

/**
 * process node
 * @param {import('../../typedefs.js').SweetNode} node - node to be processed
 * @param {Object} context
 */

let i = 0
function processNode (node, context) {
  i++
  const savedOn = this.config.templateInfo[i]

  // ignore if the node is processed
  if (node.processed) return
  node.processed = true

  if (node.nodeName === '#text') {
    processTextContent.call(this, node)
  }

  if (savedOn) {
    console.log(node.nodeName, savedOn)
    if (node.nodeName === '#comment') {
      const commentSplit = node.textContent.trim().split(' ')
      if (commentSplit[0] === 'if') {
        commentIf.call(this, node, commentSplit, savedOn)
      }
    }

    else {
      processAttributes.call(this, node, savedOn)
    }
  }
}

export default processNode
