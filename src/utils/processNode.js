function processNode (node, source = {}) {
  // no processing needed for style tag
  if (node.nodeName === 'STYLE') return

  // only process textContent in text node
  if (node.nodeName === '#text') {
    this.processTextContent(node, source)
    return
  }

  // process mapping on template with each attribute
  if (node.nodeName === 'TEMPLATE') {
    this.processMapping(node, source)
    return
  }
  // process attributes for all other nodes
  this.processAttributes(node, source)

  // if node has multiple childNodes, do not process textContent on it
  if (node.childNodes.length > 1) {
    [...node.childNodes].forEach(n => this.processNode(n, source))
  } else {
    this.processTextContent(node, source)
  }
}

export default processNode
