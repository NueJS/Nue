import getAttributes from './getAttributes.js';
import getSlice from './getSlice.js';

function processAttributes(node) {
	const attributes = getAttributes(node);

	Object.keys(attributes).forEach(name => {
		const value = attributes[name];

		// process on:event={handler}
		if (name.startsWith('on:')) {
			// remove on:event attribute from node
			node.removeAttribute(name);
			// get event from on:event
			const eventName = name.substr(3);
			// get options.handler
			const handler = this.options[attributes[name]];
			// handler should be called with current 'this'
			node.addEventListener(eventName, handler.bind(this));
		}
		// process name={value} attribute
		else if (isCurly(value)) {
			const key = this.uncurl(value);
			this.bindAttributeValue(node, name, key);

			// reactive binding for inputs
			if (node.nodeName === 'INPUT' && name === 'value') {
				const eventName = 'input';
				const handler = e => {
					const value = e.target[name];
					const isNumber = node.type === 'number' || node.type === 'range';
					mutate(this.state, key.split('.'), isNumber ? Number(value) : value, 'set');
				};

				node.addEventListener(eventName, handler);
			}
		}
	});
}

function processNode(node) {
	if (node.nodeName !== '#text') this.processAttributes(node);
	if (node.childNodes.length) [...node.childNodes].forEach(n => this.processNode(n));
	else this.processText(node);
}

function processText(node) {
	const textNodes = [];
	const text = node.textContent;
	let openBracketFound = false;
	let acc = '';

	for (let i = 0; i < text.length; i++) {
		if (openBracketFound && text[i] !== '}') acc += text[i];
		else if (text[i] === '{') {
			if (acc) {
				textNodes.push(document.createTextNode(acc));
				acc = '';
			}
			openBracketFound = true;
		} else if (text[i] === '}') {
			openBracketFound = false;
			const textNode = document.createTextNode(getSlice(state, acc));
			this.bindText(textNode, acc);
			textNodes.push(textNode);
			acc = '';
		} else {
			acc += text[i];
		}
	}

	if (acc) textNodes.push(document.createTextNode(acc));
	node.textContent = '';
	if (node.nodeName === '#text') textNodes.forEach(n => node.before(n));
	else textNodes.forEach(n => node.append(n));
}

function processMapping() {
	const map = this.getAttribute('map');
	if (map) {
		const arrName = uncurl(map);
		const arr = window.store[arrName];
		const as = this.getAttribute('as');
		this.removeAttribute('map');
		this.removeAttribute('as');

		arr.forEach(value => {
			const node = this.cloneNode(true);
			const attributes = getAttributes(node);
			Object.keys(attributes).forEach(a => {
				if (attributes[a] === as) {
					node.setAttribute(a, value);
				}
			});

			this.before(node);
		});

		this.remove();
	}
}

export { processNode, processAttributes, processText };
