import { silentMutate } from './mutate.js';

function onChange(chain, value, trap) {
	const success = silentMutate(this.state, chain, value, trap);
	const chainString = chain.join('.');
	const cbs = this.deps[chainString];
	if (cbs) {
		cbs.forEach(d => d());
		if (this.options.onStateChange) this.options.onStateChange.call(thisVal, chainString);
	}
	return success;
}

export function onStateChange(key, cb) {
	if (!this.deps[key]) this.deps[key] = [];
	this.deps[key].push(cb);
}

export default onChange;
