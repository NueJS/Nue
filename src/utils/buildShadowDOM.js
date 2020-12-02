import processNode from './process/processNode.js'
import { traverseTree } from './node/tree.js'

function buildShadowDOM (template) {
  this.attachShadow({ mode: this.mode })
  const fragment = template.content.cloneNode(true)
  fragment.childNodes.forEach(childNode => traverseTree(childNode, node => processNode.call(this, node)));
  // [...fragment.childNodes].forEach(node => processNode.call(this, node));
  [...fragment.childNodes].forEach(node => this.shadowRoot.append(node))
}

export default buildShadowDOM
