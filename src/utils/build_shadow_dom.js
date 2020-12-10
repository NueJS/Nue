import process_node from './process/node.js'
import traverse from './tree/traverse.js'

const add_memo_ids = (fragment) => {
  let memo_id = 0
  traverse(fragment, (node) => {
    // if (node.nodeName === '')
    node.memo_id = ++memo_id
  }, true)
}

function build_shadow_dom (template) {
  this.attachShadow({ mode: this.memo.mode })
  const fragment = template.content.cloneNode(true)
  add_memo_ids(fragment)
  process_node.call(this, fragment)
  this.delayed_processes.forEach(p => p());
  [...fragment.childNodes].forEach(node => this.shadowRoot.append(node))
}

export default build_shadow_dom
