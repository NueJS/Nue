import onChange, { onStateChange } from './utils/onChange.js';
import { bindTextContent, bindAttributeValue, bindInput } from './utils/bind.js';
import addState from './utils/state.js';
import buildShadowDOM from './utils/buildShadowDOM.js';
// process
import processNode from './utils/processNode.js';
import processAttributes from './utils/processAttributes.js';
import processTextContent from './utils/processTextContent.js';
import processMapping from './utils/processMapping.js';

function $(elementName, options) {
	const template = document.createElement('template');
	const style = options.css ? `<style> ${options.css}</style>` : '';
	template.innerHTML = options.html + style;

	const observedProps = Object.keys(options.state);

	class El extends HTMLElement {
		constructor() {
			// this.props is set by its parent node
			super();
			// collection of callbacks that should be called when their dependant state is changed
			this.deps = {};
			this.options = options;
			this.observedProps = observedProps;
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
			return observedProps || [];
		}

		attributeChangedCallback(prop, oldVal, newVal) {
			if (this.state) this.state[prop] = newVal;
		}
	}

	El.prototype.onChange = onChange;
	El.prototype.onStateChange = onStateChange;
	El.prototype.addState = addState;
	// binding
	El.prototype.bindTextContent = bindTextContent;
	El.prototype.bindAttributeValue = bindAttributeValue;
	El.prototype.bindInput = bindInput;
	El.prototype.buildShadowDOM = buildShadowDOM;
	// process
	El.prototype.processNode = processNode;
	El.prototype.processAttributes = processAttributes;
	El.prototype.processMapping = processMapping;
	El.prototype.processTextContent = processTextContent;

	El.prototype.dispatchCustomEvent = function (eventName, detail) {
		this.dispatchEvent(
			new CustomEvent(eventName, {
				detail,
			})
		);
	};

	customElements.define(elementName, El);
}

export default $;
