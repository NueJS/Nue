import { silentMutate } from './mutate.js';
import getSlice from './getSlice.js';

function onChange(chain, value, trap) {
	const success = silentMutate(this.state, chain, value, trap);
	const rootKey = chain[0];
	const isLengthChanged = chain[chain.length - 1] === 'length';

	// call onStateChange with chain for valid changes
	if (this.options.onStateChange) {
		// ignore .length changes for array
		if (!isLengthChanged) this.options.onStateChange.call(this, rootKey);
	}

	const cbs = this.deps[rootKey];
	if (cbs && !isLengthChanged) {
		cbs.forEach(f => f());
	}

	return success;
}

// if deps on a.b.c
// register it for a
export function onStateChange(key, cb) {
	const depKey = key.split('.')[0];
	if (!this.deps[depKey]) this.deps[depKey] = [];
	this.deps[depKey].push(cb);
}

export default onChange;
