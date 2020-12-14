import sweetify from './node/sweetify.js'
import processNode from './process/processNode.js'

function buildShadowDOM (template) {
  this.attachShadow({ mode: this.memo.mode })
  const fragment = template.content.cloneNode(true)
  sweetify(template.content, fragment)
  processNode.call(this, fragment)
  this.delayedProcesses.forEach(p => p());
  [...fragment.childNodes].forEach(node => this.shadowRoot.append(node))
}

export default buildShadowDOM
