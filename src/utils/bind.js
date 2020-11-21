// when a key in state changes, update the textContent of <node>
export function bindText(node, key) {
	this.onStateChange(key, () => {
		node.textContent = getSlice(state, key);
	});
}

// when key in state changes, update attribute <name> of <node>
export function bindAttributeValue(node, name, key) {
	node.setAttribute(name, getSlice(state, key));
	this.onStateChange(key, () => {
		node.setAttribute(name, getSlice(state, key));
	});
}
