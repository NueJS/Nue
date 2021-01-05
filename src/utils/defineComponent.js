import { connect, disconnect } from './connection/recursive.js'
import preprocess from './sweetify/preprocess.js'
import createLifecycleHooks from './createLifecycleHooks.js'
import buildShadowDOM from './buildShadowDOM.js'
// import globalInfo from './globalInfo.js'

// define a component using compName and a component function
function defineComponent (compName, component) {
  // memo is object containing information that will be same for all the instance of component
  // it is basically a class static property
  const memo = { mode: 'open', compName, template: null }

  class SuperSweet extends HTMLElement {
    constructor () {
      super()

      // for better minification, refer to this using other variable name
      const self = this

      // @TODO - use the hash to persist state across page refreshes
      // self.hash = globalInfo.hash()

      // component is the component definition
      self.component = component

      // key is path joined by dot
      self.refs = {}

      // functions added in component or given by parent component
      self.fn = self.fnProps || {}

      // function that call the cb when a certain action is performed in application
      // similar to svelte actions API
      self.actions = {}

      // callbacks which are to be called when state changes
      self.deps = { $: new Map() }

      // queue holds all the callbacks that should be called
      // queue is useful to avoid calling the callback more than once and in correct order
      self.queue = {
        stateReady: new Map(),
        computed: new Map(),
        dom: new Map()
      }

      // callbacks that are to be called when the components is connected / disconnected to DOM
      self.mountCbs = []
      self.destroyCbs = []
      self.beforeUpdateCbs = []
      self.afterUpdateCbs = []

      // memo of the component which are same for all instances
      self.memo = memo

      // array of processing functions that should be run after all the nodes have been processed
      self.deferred = []

      // @TODO - remove this function out of class
      // once all the callbacks are called, clear the queue for the next interaction
      self.clear_queue = () => {
        for (const key in self.queue) {
          self.queue[key].clear()
        }
      }

      createLifecycleHooks(self)
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
