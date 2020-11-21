function buildShadowDOM() {
	this.attachShadow({ mode: this.options.mode || 'open' });
	const parser = new DOMParser();
	const shadowDOM = parser.parseFromString(this.options.html, 'text/html');
	const shadowNodes = [...shadowDOM.body.children];
	shadowNodes.forEach(node => {
		console.log('this', this);
		this.processNode(node);
	});

	// add styles and html in shadowDOM
	const styles = document.createElement('style');
	styles.textContent = this.options.css || '';
	shadowNodes.forEach(node => this.shadowRoot.append(node));
	this.shadowRoot.append(styles);
}

export default buildShadowDOM;
