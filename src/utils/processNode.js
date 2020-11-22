function processNode(node) {
	// no processing needed for style tag
	if (node.nodeName === 'STYLE') return;

	// only process textContent in text node
	if (node.nodeName === '#text') {
		this.processTextContent(node);
		return;
	}

	// process mapping on template with each attribute
	if (node.nodeName === 'TEMPLATE') {
		this.processMapping(node);
		return;
	}

	// process attributes for all other nodes
	this.processAttributes(node);

	// if node has multiple childNodes, do not process textContent on it
	if (node.childNodes.length > 1) {
		[...node.childNodes].forEach(n => this.processNode(n));
	} else {
		this.processTextContent(node);
	}
}

export default processNode;
