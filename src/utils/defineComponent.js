import { connect, disconnect } from './connection/recursive.js'
import runComponent from './runComponent.js'
import addLifecycles, { runEvent } from './lifecycle.js'
import buildShadowDOM from './buildShadowDOM.js'
import dashify from './string/dashify.js'
import processNode from './process/processNode.js'
import globalInfo from './globalInfo.js'

function defineComponent (name, component) {
  // if the component is already defined, do nothing
  if (globalInfo.definedComponents[name]) return

  // memo is object containing information that will be same for all the instance of component
  // it is basically a class static property
  const childComps = component.uses && new Set(component.uses.map(c => c.name.toLowerCase()))

  // @TODO save the memo to globalInfo
  const memo = { name, template: null, childComps, component }

  // save the memo in globalInfo so we can check if this component is already defined or not and other uses
  globalInfo.definedComponents[name] = memo

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

    connectedCallback () {
      const comp = this.nue

      // this check is added to make sure, processing only happens once
      // and not again when component is disconnected and connected back
      if (!this.shadowRoot) {
        // add closure using parsed
        const closure = this.parsed && this.parsed.closure
        comp.closure = closure

        // add fn using closure
        comp.fn = closure ? closure.fn : {}

        // now that comp is ready, run the component
        runComponent(comp, component)

        // now that $, lifecycles, fn, etc are filled with component definition,

        // process slots
        if (this.childNodes) this.childNodes.forEach(n => processNode(comp, n))

        // process shadow dom
        buildShadowDOM(comp)
      }

      // if the connection change is due to reordering, no need to connect and disconnect
      if (comp.ignoreConnectionChange) return

      // run mount callbacks first and then connect the DOM to state
      // this allows state to set by onMount callbacks to be used directly by the DOM without having to initialize with null values
      runEvent(comp, 'onMount')

      // connect shadow DOM and slots to the component state
      connect(this.shadowRoot, true)
      connect(this)
    }

    disconnectedCallback () {
      const comp = this.nue
      // if the connection change is due to reordering, no need to connect and disconnect
      if (comp.ignoreConnectionChange) return

      // disconnect the shadow DOM and slots from component state
      disconnect(this.shadowRoot, true)
      disconnect(this, true)

      // run onDestroy callbacks
      runEvent(comp, 'onDestroy')
    }
  }

  // define the parent first and then child so that child components will have parsed on it
  customElements.define(dashify(name), Nue)

  // if the component is using other components inside it
  if (component.uses) {
    // define all of them first
    component.uses.forEach(child => {
      defineComponent(child.name, child)
    })
  }
}

export default defineComponent
