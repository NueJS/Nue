import processNode from './process/processNode.js'

function buildShadowDOM (template) {
  this.attachShadow({ mode: this.compObj.mode || 'open' })
  const fragment = template.content.cloneNode(true)
  const fragmentNodes = [...fragment.childNodes]
  fragmentNodes.forEach(node => processNode.call(this, node))
  fragmentNodes.forEach(node => this.shadowRoot.append(node))
}

export default buildShadowDOM
