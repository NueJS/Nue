import getRS from './getRS.js';

function addState() {
	// if the state is a function, call with props to get the state object
	const initState = this.options.state;
	for (const prop of this.observedProps) {
		const propValue = this.getAttribute(prop);
		if (propValue) {
			initState[prop] = propValue;
		}
	}
	// reactify state object
	this.state = getRS(initState, this.onChange.bind(this));
}

export default addState;
