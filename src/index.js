import onChange, { onStateChange } from './utils/onChange.js';
import { bindText, bindAttributeValue } from './utils/bind.js';
import addState from './utils/state.js';
import buildShadowDOM from './utils/buildShadowDOM.js';
import { processNode, processAttributes, processText } from './utils/process.js';
import getAttributes from './utils/getAttributes.js';

function $(elementName, options) {
	const template = document.createElement('template');
	const style = options.css ? `<style> ${options.css}</style>` : '';
	template.innerHTML = options.html + style;

	class El extends HTMLElement {
		constructor() {
			super();
			this.deps = {};
			this.props = options.props;
			this.options = options;
			this.addState();
			this.buildShadowDOM(template);
		}

		connectedCallback() {
			if (options.onConnect) options.onConnect.call(this);
		}

		disconnectedCallback() {
			if (options.onDisconnect) options.onDisconnect.call(this);
		}

		static get observedAttributes() {
			return options.props || [];
		}

		attributeChangedCallback(attr, oldVal, newVal) {
			if (options.onPropChange) {
				onPropChange(attr, newVal);
			}
		}
	}

	El.prototype.onChange = onChange;
	El.prototype.onStateChange = onStateChange;
	El.prototype.bindText = bindText;
	El.prototype.bindAttributeValue = bindAttributeValue;
	El.prototype.buildShadowDOM = buildShadowDOM;
	El.prototype.addState = addState;
	El.prototype.processNode = processNode;
	El.prototype.processAttributes = processAttributes;
	El.prototype.processText = processText;

	customElements.define(elementName, El);
}

export default $;
