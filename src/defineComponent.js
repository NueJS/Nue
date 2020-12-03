import buildShadowDOM from './utils/buildShadowDOM.js'
import addLifeCycles from './utils/addLifeCycles.js'
import buildTemplate from './utils/buildTemplate.js'

function defineComponent (compName, component) {
  const config = { templateInfo: { }, refs: {} }
  customElements.define(compName, class SupersweetElement extends HTMLElement {
    constructor () {
      super()
      this.handle = {}
      this.stateDeps = { $: { reactive: [], before: [], after: [], dom: [] } }
      this.mode = 'open'
      this.computedStateDeps = []
      this.compName = compName
      this.onAddCbs = []
      this.onRemoveCbs = []
      this.conditions = {}
      this.config = config
      this.actions = {}
      this.registeredCallbacks = {
        before: {},
        after: {},
        reactive: {},
        dom: {}
      }
      this.getNodeInfo = (node) => this.config.templateInfo[node.sweetuid]
      addLifeCycles.call(this)
      buildTemplate.call(this, component)
      buildShadowDOM.call(this, config.template)
      if (this.twoWayProps) this.twoWayProps.forEach(p => p())
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
