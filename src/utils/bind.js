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
