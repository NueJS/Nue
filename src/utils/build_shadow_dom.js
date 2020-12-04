import process_node from './process/process_node.js'
import { traverse } from './node/tree.js'

function build_shadow_dom (template) {
  this.attachShadow({ mode: this.memo.mode })
  const fragment = template.content.cloneNode(true)
  fragment.childNodes.forEach(childNode => traverse(childNode, node => process_node.call(this, node)));
  [...fragment.childNodes].forEach(node => this.shadowRoot.append(node))
}

export default build_shadow_dom
