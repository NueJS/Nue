import getSlice from './getSlice.js';
import { mutate } from './mutate.js';

// when a key in state changes, update the textContent of <node>
export function bindText(node, key) {
	this.onStateChange(key, () => {
		node.textContent = getSlice(this.state, key);
	});
}

// when key in state changes, update attribute <name> of <node>
export function bindAttributeValue(node, name, key) {
	node.setAttribute(name, getSlice(this.state, key));
	this.onStateChange(key, () => {
		node.setAttribute(name, getSlice(this.state, key));
	});
}

export function bindInput(node, attributeName, attributeValue) {
	if (attributeName === 'value') {
		const eventName = 'input';
		const handler = e => {
			const value = e.target[attributeName];
			const isNumber = node.type === 'number' || node.type === 'range';
			mutate(this.state, attributeValue.split('.'), isNumber ? Number(value) : value, 'set');
		};

		node.addEventListener(eventName, handler);
	}
}
