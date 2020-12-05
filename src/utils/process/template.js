import memoize_attributes from '../memoize/attributes.js'
import memoize_comment from '../memoize/comment.js'
import memoize_text_content from '../memoize/text-content.js'
import traverse from '../tree/traverse.js'

// traverse all the nodes in the template
// remove unnecessary nodes like empty text nodes which may cause issues when processing other things
// remove placeholder attributes
// it memoizes node's placeholder information like attributes, comment conditions
// since when creating a clone all the custom properties are removed, we can not store information about node directly in it
// that's why we have to store node's information on an object
// when memoizing and reusing same traversal is used thats why we can just use int++ as an id
// doing this allows us to reuse this information when a component create a clone of template

// @TODO, save text content info
function process_template () {
  const remove_nodes = []
  const childNodes = this.memo.template.content.childNodes

  childNodes.forEach(childNode =>
    traverse(childNode, node => {
      if (node.nodeName === '#text') {
        if (!node.textContent.trim()) remove_nodes.push(node)
        else {
          this.memoId++
          memoize_text_content.call(this, node)
        }
      } else if (node.nodeName === '#comment') {
        this.memoId++
        memoize_comment.call(this, node)
      } else if (node.attributes && node.attributes.length) {
        this.memoId++
        memoize_attributes.call(this, node)
      } else { this.memoId++ }
    })
  )

  remove_nodes.forEach(n => n.remove())
  this.memoId = 0
}

export default process_template
