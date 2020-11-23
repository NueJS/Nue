import { silentMutate } from './mutate.js';

function onChange(chain, value, trap) {
	const success = silentMutate(this.state, chain, value, trap);
	const chainString = chain.join('.');

	// also update props to reflect the state change
	this.state.__disableOnChange__(true);
	this.setAttribute(chain[0], this.state[chain[0]]);
	this.state.__disableOnChange__(false);

	// TODO improve this
	// instead of only checking the parent
	const cbs = this.deps[chain[0]];

	// add batching too!
	if (this.options.onStateChange) {
		// do not call cbs when arr.length is updated
		if (chain[chain.length - 1] !== 'length') this.options.onStateChange.call(this, chain[0]);
	}
	if (cbs && chain[chain.length - 1] !== 'length') {
		cbs.forEach(f => f());
	}
	return success;
}

export function onStateChange(key, cb) {
	if (!this.deps[key]) this.deps[key] = [];
	this.deps[key].push(cb);
}

export default onChange;
