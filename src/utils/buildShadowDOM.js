import processNode from './process/processNode.js'

function buildShadowDOM (template) {
  this.attachShadow({ mode: this.mode })
  const fragment = template.content.cloneNode(true)
  const fragmentNodes = [...fragment.childNodes]
  fragmentNodes.forEach(node => this.shadowRoot.append(node))
  fragmentNodes.forEach(node => processNode.call(this, node))
}

export default buildShadowDOM
