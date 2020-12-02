import saveAttributes from '../node/saveAttributes.js'
import { traverseTree } from '../node/tree.js'

function processTemplate () {
  const removeNodes = []

  traverseTree(this.config.template.content, node => {
    if (node.nodeName === '#text') {
      if (!node.textContent.trim()) removeNodes.push(node)
    }

    else if (node.attributes && node.attributes.length) {
      saveAttributes.call(this, node)
    }
  })

  removeNodes.forEach(n => n.remove())
}

export default processTemplate
