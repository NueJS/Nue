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

  class SuperSweet extends HTMLElement {
    constructor () {
      super()

      // for better minification, refer to this using other variable name
      const comp = this

      // @TODO - use the hash to persist state across page refreshes
      // comp.hash = globalInfo.hash()

      // component is the component definition
      comp.component = component

      // key is path joined by dot
      comp.refs = {}

      // functions added in component or given by parent component
      comp.fn = comp.fnProps || {}

      // function that call the cb when a certain action is performed in application
      // similar to svelte actions API
      comp.actions = {}

      // callbacks which are to be called when state changes
      comp.deps = { $: new Map() }

      // queue holds all the callbacks that should be called
      // queue is useful to avoid calling the callback more than once and in correct order
      comp.queue = {
        stateReady: new Map(),
        computed: new Map(),
        dom: new Map()
      }

      // callbacks that are to be called when the components is connected / disconnected to DOM
      comp.mountCbs = []
      comp.destroyCbs = []
      comp.beforeUpdateCbs = []
      comp.afterUpdateCbs = []

      // memo of the component which are same for all instances
      comp.memo = memo

      // array of processing functions that should be run after all the nodes have been processed
      comp.deferred = []

      // @TODO - remove this function out of class
      // once all the callbacks are called, clear the queue for the next interaction
      comp.clear_queue = () => {
        for (const key in comp.queue) {
          comp.queue[key].clear()
        }
      }

      createLifecycleHooks(comp)
    }

    // when component is added in dom
    connectedCallback () {
      const comp = this
      // console.log('should connect')
      if (comp.ignoreConnectionChange) return

      // @TODO - do not call comp functions once preprocess and building is done
      if (!comp.x) {
        preprocess(comp, component)
        buildShadowDOM(comp)
        comp.x = true
      }

      connect(comp.shadowRoot, true)
      comp.mountCbs.forEach(cb => cb())
    }

    // when the component is removed from dom
    disconnectedCallback () {
      const comp = this
      if (comp.ignoreConnectionChange) return
      disconnect(comp.shadowRoot, true)
      comp.destroyCbs.forEach(cb => cb())
    }
  }

  customElements.define(compName, SuperSweet)
}

export default defineComponent
