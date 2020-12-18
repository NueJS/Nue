import sweetify from './node/sweetify.js'
import processNode from './process/processNode.js'

function buildShadowDOM (template) {
  // create clone of template
  const fragment = template.content.cloneNode(true)

  // add sweet property on nodes
  sweetify(template.content, fragment)

  // process nodes using sweet property
  processNode.call(this, fragment)

  // perform fragment modification which is part of processing
  this.delayedProcesses.forEach(p => p())

  // add fragment to shadow DOM
  this.attachShadow({ mode: this.memo.mode });
  [...fragment.childNodes].forEach(node => this.shadowRoot.append(node))
}

export default buildShadowDOM
