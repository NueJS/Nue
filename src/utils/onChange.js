import { silentMutate } from './mutate.js';

function onChange(chain, value, trap) {
	const success = silentMutate(this.state, chain, value, trap);
	const chainString = chain.join('.');
	const cbs = this.deps[chainString];

	if (this.options.onStateChange) {
		// do not call cbs when arr.length is updated
		if (chain[chain.length - 1] !== 'length') this.options.onStateChange.call(this, chain[0]);
	}
	if (cbs && chain[chain.length - 1] !== 'length') {
		cbs.forEach(d => d());
	}
	return success;
}

export function onStateChange(key, cb) {
	if (!this.deps[key]) this.deps[key] = [];
	this.deps[key].push(cb);
}

export default onChange;
