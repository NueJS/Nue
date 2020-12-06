import memoize_attributes from './attributes.js'
// import memoize_comment from '../memoize/comment.js'
import memoize_text_content from './text-content.js'
import traverse from '../tree/traverse.js'

// traverse all the nodes in the template
// remove unnecessary nodes like empty text nodes which may cause issues when processing other things
// remove placeholder attributes
// it memoizes node's placeholder information like attributes, comment conditions
// since when creating a clone all the custom properties are removed, we can not store information about node directly in it
// that's why we have to store node's information on an object
// when memoizing and reusing same traversal is used thats why we can just use int++ as an id
// doing this allows us to reuse this information when a component create a clone of template

function memoize_template () {
  console.group('memoize_template')
  const remove_nodes = []

  // visit each node in template and memoize information
  let memo_id = 0
  const on_visit = node => {
    // console.log('visit : ', node)
    // memoize text content
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.textContent.trim()) remove_nodes.push(node)
      else memoize_text_content.call(this, node, ++memo_id)
    }

    // memoize attributes
    else if (node.hasAttributes && node.hasAttributes()) {
      memoize_attributes.call(this, node, ++memo_id)
    }

    // no memoization needed
    else {
      memo_id++
      console.log(node.nodeName, memo_id)
    }
  }

  traverse(this.memo.template.content, on_visit, true)
  // remove redundant nodes
  remove_nodes.forEach(n => n.remove())
  console.groupEnd('memoize_template')
}

export default memoize_template
