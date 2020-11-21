import onChange, { notifyDeps } from './utils/onChange.js';
import { bindText, bindAttributeValue } from './utils/bind.js';
import addState from './utils/state.js';
import buildShadowDOM from './utils/buildShadowDOM.js';
import { processNode, processAttributes, processText } from './utils/process.js';

function $(elementName, options) {
	class El extends HTMLElement {
		constructor() {
			super();
			this.deps = {};
			this.props = options.props;
			this.options = options;
			this.addState();
			this.buildShadowDOM();
		}
	}

	El.prototype.onChange = onChange;
	El.prototype.notifyDeps = notifyDeps;
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
