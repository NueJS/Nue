import getRS from './getRS.js';

function addState() {
	// if the state is a function, call with props to get the state object
	const initState =
		typeof this.options.state === 'function' ? this.options.state(props) : this.options.state;
	// reactify state object
	this.state = getRS(initState, this.onChange.bind(this));
}

export default addState;
