import { connect, disconnect } from './utils/connection/recursive.js'

import buildShadowDOM from './utils/buildShadowDOM.js'
import createLifecycleHooks from './utils/createLifecycleHooks.js'
import globalInfo from './globalInfo.js'
import preprocess from './utils/sweetify/preprocess.js'

// define a component using compName and a component function
function defineComponent (compName, component) {
  // information about component which are same among all the instances of the components
  // to improve performance these info will be moved once and will be shared by all the instances
  const memo = { mode: component.mode || 'open', compName, template: undefined }
  class SuperSweet extends HTMLElement {
    constructor () {
      super()
      const comp = this

      // @TODO - use the hash to persist state across page refreshes
      comp.hash = globalInfo.hash()

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
      // console.log('should connect')
      if (this.ignoreConnectionChange) return

      // @TODO - do not call this functions once preprocess and building is done
      if (!this.x) {
        preprocess(this, component)
        buildShadowDOM(this)
        this.x = true
      }

      connect(this.shadowRoot, true)
      this.mountCbs.forEach(cb => cb())
    }

    // when the component is removed from dom
    disconnectedCallback () {
      if (this.ignoreConnectionChange) return
      disconnect(this.shadowRoot, true)
      this.destroyCbs.forEach(cb => cb())
    }
  }

  customElements.define(compName, SuperSweet)
}

export default defineComponent
