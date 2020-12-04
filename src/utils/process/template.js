import memoize_attributes from '../memoize/attributes.js'
import memoize_comment from '../memoize/comment.js'
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
let i = 0
function process_template () {
  const remove_nodes = []
  const childNodes = this.memo.template.content.childNodes

  childNodes.forEach(childNode =>
    traverse(childNode, node => {
      if (node.nodeName === '#text' && !node.textContent.trim()) {
        remove_nodes.push(node)
      } else if (node.nodeName === '#comment') {
        i++
        memoize_comment.call(this, node, i)
      } else if (node.attributes && node.attributes.length) {
        i++
        memoize_attributes.call(this, node, i)
      } else { i++ }
    })
  )

  remove_nodes.forEach(n => n.remove())
}

export default process_template
