import { connect, disconnect } from './connection/recursive.js'
import preprocess from './sweetify/preprocess.js'
import createLifecycleHooks from './createLifecycleHooks.js'
import buildShadowDOM from './buildShadowDOM.js'
// import globalInfo from './globalInfo.js'

// define a component using compName and a component function
function defineComponent (compName, component) {
  // memo is object containing information that will be same for all the instance of component
  // it is basically a class static property
  // @TODO move it to globalInfo
  const memo = { compName, template: null }

  // @TODO - use the hash to persist state across page refreshes
  // comp.hash = globalInfo.hash()

  class SuperSweet extends HTMLElement {
    constructor () {
      super()
      this.supersweet = {
        self: this,
        component,
        refs: {},
        actions: {},
        deps: { $: new Map() },
        fn: this.fnProps || {},

        // callbacks that are to be called in various phases
        queue: {
          stateReady: new Map(),
          computed: new Map(),
          dom: new Map()
        },

        // lifecycle callbacks
        mountCbs: [],
        destroyCbs: [],
        beforeUpdateCbs: [],
        afterUpdateCbs: [],

        // common data between all instances of component
        memo,

        // methods to be invoked after certain phase is completed
        deferred: [],
        name: compName
      }

      const comp = this.supersweet
      createLifecycleHooks(comp)
    }

    // when component is added in dom
    connectedCallback () {
      const comp = this.supersweet
      if (comp.ignoreConnectionChange) return

      // do not build shadow DOM it it's done already
      if (!this.shadowRoot) {
        preprocess(comp, component)
        buildShadowDOM(comp)
      }

      // before connecting component to state, run onMount callbacks
      comp.mountCbs.forEach(cb => cb())

      // connect component to state and make it reactive
      connect(this.shadowRoot, true)
    }

    // when the component is removed from dom
    disconnectedCallback () {
      const comp = this.supersweet
      if (comp.ignoreConnectionChange) return
      disconnect(this.shadowRoot, true)
      comp.destroyCbs.forEach(cb => cb())
    }
  }

  customElements.define(compName, SuperSweet)
}

export default defineComponent
