import { connect, disconnect } from './connection/recursive.js'
import preprocess from './sweetify/preprocess.js'
import createLifecycleHooks from './createLifecycleHooks.js'
import buildShadowDOM from './buildShadowDOM.js'
import globalInfo from './globalInfo.js'
import dashify from './string/dashify.js'
// import globalInfo from './globalInfo.js'
// define a component using name and a component function
function defineComponent (component) {
  // memo is object containing information that will be same for all the instance of component
  // it is basically a class static property
  // @TODO move it to globalInfo
  const name = component.name

  globalInfo.components[name] = component
  const childComps = component.uses && new Set(component.uses.map(c => c.name.toLowerCase()))
  const memo = { name, template: null, childComps, component }

  class Nue extends HTMLElement {
    constructor () {
      super()
      this.nue = {
        self: this,
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
        closure: this.sweet && this.sweet.closure
      }

      const comp = this.nue
      createLifecycleHooks(comp)
      preprocess(comp, component)
      buildShadowDOM(comp)
    }

    // when component is added in dom
    connectedCallback () {
      const comp = this.nue
      if (comp.ignoreConnectionChange) return
      // run mount callbacks first and then connect the DOM to state
      // this allows state to set by onMount callbacks to be used directly by the DOM without having to initialize with null values
      comp.mountCbs.forEach(cb => cb())
      connect(this.shadowRoot, true)
    }

    // when the component is removed from dom
    disconnectedCallback () {
      const comp = this.nue
      if (comp.ignoreConnectionChange) return
      disconnect(this.shadowRoot, true)
      comp.destroyCbs.forEach(cb => cb())
    }
  }

  customElements.define(dashify(name), Nue)

  if (component.uses) {
    component.uses.forEach(child => {
      defineComponent(child)
    })
  }
}

export default defineComponent
