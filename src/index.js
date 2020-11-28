import buildShadowDOM from './utils/buildShadowDOM.js'
import reactify from './utils/reactivity/reactify.js'
import addLifeCycles from './utils/addLifeCycles.js'
import buildTemplate from './utils/buildTemplate.js'

function element (compName, component) {
  const config = {}

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
      addLifeCycles.call(this)

      const state = reactify.call(this, this.props || {})
      buildTemplate.call(this, component, state, config)
      this.state = state

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
  textNode.parentNode.style.background = '#55efc4'
  setTimeout(() => {
    textNode.parentNode.style.background = null
  }, 300)
}

const supersweet = {
  element,
  showUpdates: true,
  nodeUpdated,
  commonCSS: ':host {display: block;}',
  loadedComponents: {},
  paths: {},
  elements: {}
}

window.supersweet = supersweet
