import { uncurl } from './str.js';
import getAttributes from './getAttributes.js';

function processMapping(node) {
	const each = node.getAttribute('each');
	if (each) {
		const as = node.getAttribute('as');
		const at = node.getAttribute('at');
		const asVal = uncurl(as);
		const atVal = uncurl(at);
		const depKey = uncurl(each);

		function buildNodes() {
			const array = this.state[depKey];
			array.forEach((value, i) => {
				const frag = node.content.cloneNode(true);
				[...frag.children].forEach(fragNode => {
					// process text
					this.processTextContent(fragNode, { [asVal]: value, [atVal]: i }, false);
					// process attributes
					const attributes = getAttributes(fragNode);
					for (const attributeName in attributes) {
						if (attributes[attributeName] === as) {
							fragNode.setAttribute(attributeName, value);
						}

						if (attributes[attributeName] === at) {
							fragNode.setAttribute(attributeName, i);
						}
					}
				});
				// add only at the end
				node.before(frag);
			});
		}

		buildNodes.call(this);

		// when array is changed need to build it again
		this.onStateChange(depKey, () => {
			// remove previously added nodes
			buildNodes.call(this);
		});
	}
}

export default processMapping;
