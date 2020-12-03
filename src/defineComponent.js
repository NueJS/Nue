import buildShadowDOM from './utils/buildShadowDOM.js'
import addLifeCycles from './utils/addLifeCycles.js'
import buildTemplate from './utils/buildTemplate.js'

// define a component using compName and a component function
// component function will define html, css, state, life cycles, actions etc
function defineComponent (compName, component) {
  // information about component which are same among all the instances of the components
  // to improve performance these info will be calculated once and will be shared by all the instances
  const config = { templateInfo: { }, refs: {}, mode: 'open', componentName: compName }

  // define web component
  customElements.define(compName, class SuperSweet extends HTMLElement {
    constructor () {
      super()

      // event handlers defined in component
      this.handle = {}

      // callbacks which are to be called when state changes
      // reactive callbacks are for updating state slices which depend on other state slices
      // before callbacks are added by component which will be called before the DOM is updated
      // after callbacks are added by component which will be called after the DOM is updated
      // dom callbacks are added by nodes which updates text/attributes/state on dom nodes
      this.stateDeps = { $: { reactive: [], before: [], after: [], dom: [] } }

      // tag name of the component
      this.compName = compName

      // callbacks that are to be called when the components is connected / disconnected to DOM
      this.onAddCbs = []
      this.onRemoveCbs = []

      // config of the component which are same for all instances
      this.config = config

      // actions API
      this.actions = {}

      // callbacks that should be called when a state changes
      // this is for calling callbacks in proper order
      // order: 1.reactive 2. before 3. dom 4. after
      this.registeredCallbacks = {
        before: {},
        after: {},
        reactive: {},
        dom: {}
      }

      // add methods to add life cycles callbacks in the component
      // on.add, on.beforeUpdate, on.afterUpdate, on.remove, on.reactive, on.dom
      addLifeCycles.call(this)

      // process the template - one times only
      // memoize template info to reuse in other instances
      // if memoized already, set up state
      buildTemplate.call(this, component)

      // create copy of template, process nodes using state, add event listeners, add nodes in DOM
      buildShadowDOM.call(this, config.template)

      // if this component has two way props - meaning that when state of this component changes we have to update the parent's state as well
      // add parent's state update callbacks in this component so that they are called when this component's state changes
      if (this.twoWayProps) this.twoWayProps.forEach(p => p())
    }

    // when component is added in dom
    connectedCallback () {
      this.onAddCbs.forEach(cb => cb())
    }

    // when the component is removed from dom
    // run cleanups
    disconnectedCallback () {
      this.onRemoveCbs.forEach(cb => cb())
    }
  })
}

export default defineComponent
