import build_shadow_dom from './utils/build_shadow_dom.js'
import add_lifecycle_hooks from './utils/add_lifecycle_hooks.js'
import setup_processing from './utils/process/setup_processing.js'

// define a component using compName and a component function
// component function will define html, css, state, life cycles, actions etc
function define_component (compName, component) {
  // define web component

  // information about component which are same among all the instances of the components
  // to improve performance these info will be calculated once and will be shared by all the instances
  const memo = { nodes: { }, refs: {}, mode: 'open', componentName: compName }
  class SuperSweet extends HTMLElement {
    constructor () {
      super()

      // event handlers defined in component
      this.handle = {}
      this.fn = {} // replace handle API with this

      // callbacks which are to be called when state changes
      // reactive callbacks are for updating state slices which depend on other state slices
      // before callbacks are added by component which will be called before the DOM is updated
      // after callbacks are added by component which will be called after the DOM is updated
      // dom callbacks are added by nodes which updates text/attributes/state on dom nodes
      this.slice_deps = { $: { reactive: [], before: [], after: [], dom: [] } }

      // tag name of the component
      this.compName = compName

      // callbacks that are to be called when the components is connected / disconnected to DOM
      this.add_callbacks = []
      this.remove_callbacks = []

      // memo of the component which are same for all instances
      this.memo_id = 0
      this.memo = memo
      this.add_to_queue = false
      this.changed_slices = []

      // array of processing functions that should be run after all the nodes have been processed
      this.delayed_processes = []

      this.memo_of = (node) => this.memo.nodes[node.memo_id]

      // actions API
      this.actions = {}

      // callbacks that should be called when a state changes
      // this is for calling callbacks in proper order
      // order: 1.reactive 2. before 3. dom 4. after

      this.queue = {
        before: new Map(),
        after: new Map(),
        reactive: new Map(),
        dom: new Map()
      }

      this.clear_queue = () => {
        for (const key in this.queue) {
          this.queue[key].clear()
        }
      }

      // add methods to add life cycles callbacks in the component
      // on.add, on.beforeUpdate, on.afterUpdate, on.remove, on.reactive, on.dom
      add_lifecycle_hooks.call(this)

      // process the template - one times only
      // memoize template info to reuse in other instances
      // if memoized already, set up state
      setup_processing.call(this, component)

      // create copy of template, process nodes using state, add event listeners, add nodes in DOM
      build_shadow_dom.call(this, this.memo.template)

      // if this component has two way props - meaning that when state of this component changes we have to update the parent's state as well
      // add parent's state update callbacks in this component so that they are called when this component's state changes
      if (this.two_way_props) this.two_way_props.forEach(p => p())
    }

    // when component is added in dom
    connectedCallback () {
      this.add_callbacks.forEach(cb => cb())
    }

    // when the component is removed from dom
    // run cleanups
    disconnectedCallback () {
      this.remove_callbacks.forEach(cb => cb())
    }
  }

  customElements.define(compName, SuperSweet)
}

export default define_component
