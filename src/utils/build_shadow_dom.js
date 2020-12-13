import process_node from './process/node.js'
// import traverse from './tree/traverse.js'

const sweetify = (node1, node2) => {
  if (node1.supersweet) {
    // console.log('save sweet info to', node2)
    node2.supersweet = node1.supersweet
  }

  if (node1.hasChildNodes()) {
    node1.childNodes.forEach((n1, i) => {
      sweetify(n1, node2.childNodes[i])
    })
  }
}

function build_shadow_dom (template) {
  this.attachShadow({ mode: this.memo.mode })
  const fragment = template.content.cloneNode(true)
  sweetify(template.content, fragment)
  process_node.call(this, fragment)
  this.delayed_processes.forEach(p => p());
  [...fragment.childNodes].forEach(node => this.shadowRoot.append(node))
}

export default build_shadow_dom
