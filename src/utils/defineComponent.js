import { connect, disconnect } from './connection/recursive.js'
import preprocess from './sweetify/preprocess.js'
import createLifecycleHooks from './createLifecycleHooks.js'
import buildShadowDOM from './buildShadowDOM.js'
import globalInfo from './globalInfo.js'
// import globalInfo from './globalInfo.js'

const namify = (name) => {
  return name.toLowerCase() + '-'
}

// define a component using name and a component function
function defineComponent (component) {
  // memo is object containing information that will be same for all the instance of component
  // it is basically a class static property
  // @TODO move it to globalInfo
  const name = component.name
  const memo = { name, template: null }

  globalInfo.components[name] = component

  class SuperSweet extends HTMLElement {
    constructor () {
      super()
      this.supersweet = {
        childCompNames: component.uses && new Set(component.uses.map(c => c.name.toLowerCase())),
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
        name,
        closure: this.sweet && this.sweet.closure
      }

      const comp = this.supersweet
      createLifecycleHooks(comp)
      preprocess(comp, component)
      buildShadowDOM(comp)
    }

    // when component is added in dom
    connectedCallback () {
      const comp = this.supersweet
      if (comp.ignoreConnectionChange) return
      // run mount callbacks first and then connect the DOM to state
      comp.mountCbs.forEach(cb => cb())
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

  customElements.define(namify(name), SuperSweet)

  if (component.uses) {
    component.uses.forEach(child => {
      defineComponent(child)
    })
  }
}

export default defineComponent
