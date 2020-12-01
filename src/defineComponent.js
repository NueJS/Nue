/**
 * create a supersweet web component
 * @param {string} compName
 * @param {Object} component
 */
import buildShadowDOM from './utils/buildShadowDOM.js'
import addLifeCycles from './utils/addLifeCycles.js'
import buildTemplate from './utils/buildTemplate.js'

function defineComponent (compName, component) {
  const config = { templateInfo: { }, refs: {} }
  customElements.define(compName, class SupersweetElement extends HTMLElement {
    constructor () {
      super()
      // window.supersweet.elements[compName] = true
      this.showError = (str) => {
        this.shadowRoot.innerHTML = `<h1> ERROR: ${str}</h1> <style> :host{ color: red; font-family: monospace;}</style>`
        throw new Error(str)
      }
      this.handle = {}
      this.stateDeps = { $: [] }
      this.mode = 'open'
      this.computedStateDeps = []
      this.compName = compName
      this.onAddCbs = []
      this.onRemoveCbs = []
      this.conditions = {}
      this.config = config

      this.getNodeInfo = (node) => this.config.templateInfo[node.sweetuid]

      addLifeCycles.call(this)
      buildTemplate.call(this, component)
      buildShadowDOM.call(this, config.template)
      if (this.twoWayProps) this.twoWayProps.forEach(p => p())
      // console.log({ two: this.twoWayProps })
    }

    connectedCallback () {
      this.onAddCbs.forEach(cb => cb())
    }

    disconnectedCallback () {
      this.onRemoveCbs.forEach(cb => cb())
    }
  })
}

export default defineComponent
