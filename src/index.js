import buildShadowDOM from './utils/buildShadowDOM.js'
import addLifeCycles from './utils/addLifeCycles.js'
import buildTemplate from './utils/buildTemplate.js'

function element (compName, component) {
  const config = { templateInfo: { } }
  customElements.define(compName, class extends HTMLElement {
    constructor () {
      super()
      window.supersweet.elements[compName] = true
      this.handle = {}
      this.stateDeps = { $: [] }
      this.mode = 'open'
      this.computedStateDeps = []
      this.refs = {}
      this.compName = compName
      this.onAddCbs = []
      this.onRemoveCbs = []
      this.conditions = {}
      this.config = config
      this.getNodeInfo = (node) => this.config.templateInfo[node.sweetuid]
      addLifeCycles.call(this)
      buildTemplate.call(this, component, config)
      buildShadowDOM.call(this, config.template)
    }

    connectedCallback () {
      this.onAddCbs.forEach(cb => cb())
    }

    disconnectedCallback () {
      this.onRemoveCbs.forEach(cb => cb())
    }
  })
}

const nodeUpdated = (textNode) => {
  const parentStyle = textNode.parentNode.style
  if (parentStyle) {
    parentStyle.background = '#55efc4'
    setTimeout(() => {
      parentStyle.background = null
    }, 300)
  }
}

const supersweet = {
  element,
  showUpdates: false,
  nodeUpdated,
  commonCSS: ':host {display: block;}',
  loadedComponents: {},
  paths: {},
  elements: {}
}

window.supersweet = supersweet
