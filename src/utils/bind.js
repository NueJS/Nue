import getSlice from './getSlice.js';
import { mutate } from './mutate.js';

export function bindTextContent(node, key) {
	this.onStateChange(key, () => {
		node.textContent = getSlice(this.state, key);
	});
}

// when key in state changes, update attribute <name> of <node>
export function bindAttributeValue(node, name, key) {
	const value = getSlice(this.state, key);
	const isProp = name[0] === ':';
	const propName = name.substr(1);
	if (isProp) {
		if (!node.props) node.props = {};
		node.props[propName] = value;
		node.removeAttribute(name);
		this.onStateChange(key, () => {
			node.state[propName] = getSlice(this.state, key);
		});
	} else {
		node.setAttribute(name, value);
		this.onStateChange(key, () => {
			node.setAttribute(name, getSlice(this.state, key));
		});
	}
}

export function bindInput(node, attributeName, attributeValue) {
	if (attributeName === 'value') {
		const eventName = 'input';
		const attributeValueSplit = attributeValue.split('.');
		const isNumber = node.type === 'number' || node.type === 'range';
		const handler = e => {
			let value = e.target[attributeName];
			value = isNumber ? Number(value) : value;
			mutate(this.state, attributeValueSplit, value, 'set');
		};

		node.addEventListener(eventName, handler);
	}
}
