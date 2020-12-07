import split from '../string/split.js'

function memoize_text_content (node, memo_id) {
  // console.log(node.nodeName, memo_id, node.textContent)
  this.memo.nodes[memo_id] = {}
  const parts = split.call(this, node.textContent)
  this.memo.nodes[memo_id].parts = parts
}

export default memoize_text_content
