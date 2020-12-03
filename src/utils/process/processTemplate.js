import saveAttributes from '../node/saveAttributes.js'
import saveCommentInfo from '../node/saveCommentInfo.js'
import { traverseTree } from '../node/tree.js'

let i = 0
function processTemplate () {
  const removeNodes = []
  const childNodes = this.config.template.content.childNodes

  childNodes.forEach(childNode =>
    traverseTree(childNode, node => {
      if (node.nodeName === '#text') {
        if (!node.textContent.trim()) removeNodes.push(node)
        else {
          i++
          // console.log(node.nodeName, i)
        }
      } else if (node.nodeName === '#comment') {
        i++
        saveCommentInfo.call(this, node, i)
      }

      else if (node.attributes && node.attributes.length) {
        i++
        saveAttributes.call(this, node, i)
      }

      else {
        i++
        // console.log(node.nodeName, i)
      }
    })
  )

  removeNodes.forEach(n => n.remove())
}

export default processTemplate
