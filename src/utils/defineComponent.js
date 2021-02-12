import { connect, disconnect } from './connection/recursive.js'
import runComponent from './runComponent.js'
import addLifecycles, { runEvent } from './lifecycle.js'
import buildShadowDOM from './buildShadowDOM.js'
import globalInfo from './globalInfo.js'
import dashify from './string/dashify.js'

// define a component using name and a component function
function defineComponent (name, component) {
  // memo is object containing information that will be same for all the instance of component
  // it is basically a class static property
  // @TODO move it to globalInfo
  globalInfo.components[name] = component
  const childComps = component.uses && new Set(component.uses.map(c => c.name.toLowerCase()))
  const memo = { name, template: null, childComps, component }

  class Nue extends HTMLElement {
    constructor () {
      super()
      const comp = this.nue = {
        node: this,
        refs: {},
        actions: {},
        deps: { $: new Map() },

        // callbacks that are to be called in various phases
        queue: {
          stateReady: new Map(),
          computed: new Map(),
          dom: new Map()
        },

        // common data between all instances of component
        memo,

        // methods to be invoked after certain phase is completed
        deferred: []

      }

      addLifecycles(comp)
    }

    // when component is added in dom
    connectedCallback () {
      const comp = this.nue

      // must run runComponent after the node is connected, to make sure that it gets stateProps from node.parsed
      if (!this.shadowRoot) {
        const closure = this.parsed && this.parsed.closure
        comp.closure = closure
        comp.fn = closure ? closure.fn : {}

        runComponent(comp, component)
        buildShadowDOM(comp)
      }
      if (comp.ignoreConnectionChange) return

      // run mount callbacks first and then connect the DOM to state
      // this allows state to set by onMount callbacks to be used directly by the DOM without having to initialize with null values
      runEvent(comp, 'onMount')
      connect(this.shadowRoot, true)
    }

    // when the component is removed from dom
    disconnectedCallback () {
      const comp = this.nue
      if (comp.ignoreConnectionChange) return
      disconnect(this.shadowRoot, true)
      runEvent(comp, 'onDestroy')
    }
  }

  // define the parent first and then child so that child components will have parsed on it
  customElements.define(dashify(name), Nue)

  if (component.uses) {
    component.uses.forEach(child => {
      defineComponent(child.name, child)
    })
  }
}

export default defineComponent
