// compute this.props from options.props
function computeProps() {
	this.props = {};
	if (this.options.props) {
		for (const p of this.options.props) {
			this.props[p] = this.getAttribute(p);
		}
	}
}

export default computeProps;
