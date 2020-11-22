import onChange, { onStateChange } from './utils/onChange.js';
import { bindText, bindAttributeValue, bindInput } from './utils/bind.js';
import addState from './utils/state.js';
import buildShadowDOM from './utils/buildShadowDOM.js';
// process
import processNode from './utils/processNode.js';
import processAttributes from './utils/processAttributes.js';
import processTextContent from './utils/processTextContent.js';
import processMapping from './utils/processMapping.js';
import computeProps from './utils/computeProps.js';

function $(elementName, options) {
	const template = document.createElement('template');
	const style = options.css ? `<style> ${options.css}</style>` : '';
	template.innerHTML = options.html + style;

	class El extends HTMLElement {
		constructor() {
			super();
			this.deps = {};
			this.options = options;
			this.computeProps();
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
	El.prototype.addState = addState;
	El.prototype.computeProps = computeProps;
	// binding
	El.prototype.bindText = bindText;
	El.prototype.bindAttributeValue = bindAttributeValue;
	El.prototype.bindInput = bindInput;
	El.prototype.buildShadowDOM = buildShadowDOM;
	// process
	El.prototype.processNode = processNode;
	El.prototype.processAttributes = processAttributes;
	El.prototype.processMapping = processMapping;
	El.prototype.processTextContent = processTextContent;

	customElements.define(elementName, El);
}

export default $;
