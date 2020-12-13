import memoAttributes from './attributes.js'
// import memoize_comment from '../memoize/comment.js'
import memoText from './text.js'
import traverse from '../node/traverse.js'

// traverse all the nodes in the template
// remove unnecessary nodes like empty text nodes which may cause issues when processing other things
// remove placeholder attributes
// it memoizes node's placeholder information like attributes, comment conditions
// since when creating a clone all the custom properties are removed, we can not store information about node directly in it
// that's why we have to store node's information on an object
// when memoizing and reusing same traversal is used thats why we can just use int++ as an id
// doing this allows us to reuse this information when a component create a clone of template

function memoTemplate () {
  const remove_nodes = []
  this.delayed_memoizations = []

  // visit each node in template and memoize information
  const onVisit = node => {
    node.sweet = {}
    // memoize text content
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) remove_nodes.push(node)
      else memoText.call(this, node)
    }

    // memoize attributes
    else if (node.hasAttributes && node.hasAttributes()) {
      memoAttributes.call(this, node)
    }
  }

  traverse(this.memo.template.content, onVisit, true)

  // remove redundant nodes
  this.delayed_memoizations.forEach(m => m())
  remove_nodes.forEach(n => n.remove())
}

export default memoTemplate
