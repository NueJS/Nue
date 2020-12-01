import processNode from './process/processNode.js'

function buildShadowDOM (template) {
  this.attachShadow({ mode: this.mode })
  const fragment = template.content.cloneNode(true);
  [...fragment.childNodes].forEach(node => processNode.call(this, node));
  [...fragment.childNodes].forEach(node => this.shadowRoot.append(node))
}

export default buildShadowDOM
