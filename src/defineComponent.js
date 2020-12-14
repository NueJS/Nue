import buildShadowDOM from './utils/buildShadowDOM.js'
import createLifecycleHooks from './utils/createLifecycleHooks.js'
import preprocess from './utils/sweetify/preprocess.js'

// define a component using compName and a component function
// component function will define html, css, state, life cycles, actions etc
function define_component (compName, component) {
  // define web component

  // information about component which are same among all the instances of the components
  // to improve performance these info will be calculated once and will be shared by all the instances
  const memo = { mode: component.mode || 'open', compName, template: undefined }
  class SuperSweet extends HTMLElement {
    constructor () {
      super()
      this.component = component

      // references to DOM nodes
      this.refs = {}

      // console.log('prev fn : ', this.fnProps)
      // functions added in component or given by parent component
      this.fn = this.fnProps || {}

      // function that call the cb when a certain action is performed in application
      // similar to svelte actions API
      this.actions = {}

      // callbacks which are to be called when state changes
      // reactive callbacks are for updating functional state when the state it deps on is changed
      // before callbacks are be called before the DOM is updated
      // after callbacks are called after the DOM is updated
      // dom callbacks are added by nodes which updates text/attributes/state on dom nodes
      this.deps = { $: { computed: [], stateReady: [], dom: [] } }

      // queue holds all the callbacks that should be called
      // queue is useful to avoid calling the callback more than once and in correct order
      this.queue = {
        stateReady: new Map(),
        computed: new Map(),
        dom: new Map()
      }

      // callbacks that are to be called when the components is connected / disconnected to DOM
      this.mountCbs = []
      this.destroyCbs = []
      this.beforeUpdateCbs = []
      this.afterUpdateCbs = []

      // memo of the component which are same for all instances
      this.memo = memo

      // array of processing functions that should be run after all the nodes have been processed
      this.delayedProcesses = []

      // once all the callbacks are called, clear the queue for the next interaction
      this.clear_queue = () => {
        for (const key in this.queue) {
          this.queue[key].clear()
        }
      }

      // add methods to add life cycles callbacks in the component
      // on.add, on.beforeUpdate, on.afterUpdate, on.remove, on.reactive, on.dom
      createLifecycleHooks.call(this)

      // process the template - one times only
      // memoize template info to reuse in other instances
      // if memoized already, set up state
      preprocess.call(this, component)

      // create copy of template, process nodes using state, add event listeners, add nodes in DOM
      buildShadowDOM.call(this, this.memo.template)

      // if this component has two way props - meaning that when state of this component changes we have to update the parent's state as well
      // add parent's state update callbacks in this component so that they are called when this component's state changes
      if (this.two_way_props) this.two_way_props.forEach(p => p())
    }

    // when component is added in dom
    connectedCallback () {
      this.mountCbs.forEach(cb => cb())
    }

    // when the component is removed from dom
    // run cleanups
    disconnectedCallback () {
      this.destroyCbs.forEach(cb => cb())
    }
  }

  customElements.define(compName, SuperSweet)
}

export default define_component
