import process_node from './process/node.js'
import traverse from './tree/traverse.js'

function build_shadow_dom (template) {
  this.attachShadow({ mode: this.memo.mode })
  const fragment = template.content.cloneNode(true)
  // this.memo_id = 0

  // add memo_id on nodes
  // console.group('add memo_id')
  let memo_id = 0
  traverse(fragment, (node) => {
    ++memo_id
    // console.log(node.nodeName, memo_id)
    node.memo_id = memo_id
  }, true)
  // console.groupEnd('add memo_id')

  process_node.call(this, fragment, 0);
  [...fragment.childNodes].forEach(node => this.shadowRoot.append(node))
}

export default build_shadow_dom
