import getAttributes from './getAttributes.js';
import { isCurled, uncurl } from './str.js';

function processAttributes(node) {
	const attributes = getAttributes(node);

	for (const attributeName in attributes) {
		// get placeholder value of attribute
		let attributeValue = attributes[attributeName];

		// if attribute value is not curled, no processing is needed
		if (!isCurled(attributeValue)) continue;
		attributeValue = uncurl(attributeValue);

		// if event handler attribute
		if (attributeName.startsWith('@')) {
			node.removeAttribute(attributeName); // remove @event={handler} from node
			const eventName = attributeName.substr(1); // get event from @event
			const handler = this.options[attributeValue]; // add event listener, bind the handler

			node.addEventListener(eventName, handler.bind(this));
		} else {
			this.bindAttributeValue(node, attributeName, attributeValue);
			if (node.nodeName === 'INPUT') this.bindInput(node, attributeName, attributeValue);
		}
	}
}

export default processAttributes;
