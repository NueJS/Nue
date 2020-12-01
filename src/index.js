import buildShadowDOM from './utils/buildShadowDOM.js'
import addLifeCycles from './utils/addLifeCycles.js'
import buildTemplate from './utils/buildTemplate.js'

/**
 * create a supersweet web component
 * @param {string} compName
 * @param {Object} component
 */

function defineComponent (compName, component) {
  const config = { templateInfo: { }, refs: {} }
  customElements.define(compName, class SupersweetElement extends HTMLElement {
    constructor () {
      super()
      window.supersweet.elements[compName] = true
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

/**
 * this function is called when any textNode is updated, this is for dev only
 * @param {HTMLElement} textNode
 */

function nodeUpdated (textNode) {
  // @ts-ignore
  const parentStyle = textNode.parentNode.style
  if (parentStyle) {
    parentStyle.background = '#55efc4'
    setTimeout(() => {
      parentStyle.background = null
    }, 300)
  }
}

const supersweet = {
  defineComponent,
  showUpdates: false,
  nodeUpdated,
  commonCSS: ':host {display: block;}',
  loadedComponents: {},
  paths: {},
  elements: {},
  render: (component) => {
    if (!component.config) throw new Error(`${component.name} component is missing config`)
    if (component.config.uses && component.config.uses.length) {
      component.config.uses.forEach(c => {
        window.supersweet.render(c)
      })
    }
    window.supersweet.defineComponent(component.config.name, component)
  }
}

window.supersweet = supersweet
