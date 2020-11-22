import getSlice from './getSlice.js';

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

export function bindInput(node, attributeName) {
	if (attributeName === 'value') {
		const eventName = 'input';
		const handler = e => {
			const value = e.target[attributeName];
			const isNumber = node.type === 'number' || node.type === 'range';
			mutate(this.state, key.split('.'), isNumber ? Number(value) : value, 'set');
		};

		node.addEventListener(eventName, handler);
	}
}
