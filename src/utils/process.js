import getAttributes from './getAttributes.js';
import getSlice from './getSlice.js';
import { isCurled, uncurl } from './str.js';

function processAttributes(node) {
	const attributes = getAttributes(node);

	Object.keys(attributes).forEach(name => {
		const value = uncurl(attributes[name]);

		// process on:event={handler}
		if (name.startsWith('@')) {
			// remove on:event attribute from node
			node.removeAttribute(name);
			// get event from on:event
			const eventName = name.substr(1);
			// get options.handler
			const handler = this.options[value];
			// handler should be called with current 'this'
			node.addEventListener(eventName, handler.bind(this));
		}
		// process name={value} attribute
		else if (isCurled(value)) {
			const key = uncurl(value);
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
	if (node.nodeName === 'STYLE') return;
	if (node.nodeName === 'TEMPLATE') {
		const each = node.getAttribute('each');

		if (each) {
			const as = uncurl(node.getAttribute('as'));
			const at = uncurl(node.getAttribute('at'));
			const frag = node.content.cloneNode(true);
			const array = this.state[uncurl(each)];

			console.log({ as, at });
			console.log(frag.childNodes);
		}
		return;
	}
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
