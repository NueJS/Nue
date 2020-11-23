// replace placeholders with actual content from state
// and add state dependency on node's text and attributes
// then append these nodes to shadowRoot

function buildShadowDOM (template) {
  this.attachShadow({ mode: this.options.mode || 'open' })
  const fragment = template.content.cloneNode(true)
  const shadowNodes = [...fragment.childNodes]
  shadowNodes.forEach(node => this.shadowRoot.append(node))
  shadowNodes.forEach(node => this.processNode(node))
}

export default buildShadowDOM
