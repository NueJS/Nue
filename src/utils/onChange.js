function onChange(chain, value, trap) {
	const success = silentMutate(this.state, chain, value, trap);
	const chainString = chain.join('.');
	const cbs = this.deps[chainString];
	if (cbs) {
		cbs.forEach(d => d());
		if (this.options.onStateChange) this.options.onStateChange.call(thisVal, chainString);
	} else {
		console.warn(
			`state.${chain} is being updated in component, but is not being used. Either use it in component or remove it from state`
		);
	}
	return success;
}

export function notifyDeps(key, cb) {
	if (!this.deps[key]) this.deps[key] = [];
	this.deps[key].push(cb);
}

export default onChange;
