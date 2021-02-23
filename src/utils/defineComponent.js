import { connect, disconnect } from './connection/recursive.js'
import runComponent from './runComponent.js'
import addLifecycles, { runEvent } from './lifecycle.js'
import buildShadowDOM from './buildShadowDOM.js'
import dashify from './string/dashify.js'
import processNode from './process/processNode.js'
import globalInfo from './globalInfo.js'
import addStateFromAttribute from './addStateFromAttribute.js'
import { upper } from './others.js'
import { STATE, STATIC_STATE } from './constants.js'

function defineComponent (name, component) {
  // if the component is already defined, do nothing
  if (globalInfo.definedComponents[name]) return

  // memo is object containing information that will be same for all the instance of component
  // it is basically a class static property
  let childComps = {}
  if (component.uses) {
    childComps = component.uses.reduce((hash, comp) => {
      const key = upper(comp.name)
      hash[key] = dashify(comp.name)
      return hash
    }, {})
  }

  // @TODO save the memo to globalInfo
  const memo = { name, template: null, childComps, component }

  // save the memo in globalInfo so we can check if this component is already defined or not and other uses
  globalInfo.definedComponents[name] = memo

  class Nue extends HTMLElement {
    constructor () {
      super()
      const nue = this.nue = {
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
        ...memo,
        // methods to be invoked after certain phase is completed
        deferred: [],
        initState: {}
      }

      addLifecycles(nue)
    }

    connectedCallback () {
      const nue = this.nue

      // this check is added to make sure, processing only happens once
      // and not again when component is disconnected and connected back
      if (!this.shadowRoot) {
        // add closure using parsed
        const closure = this.parsed && this.parsed.closure
        nue.closure = closure
        nue.loopClosure = this.parsed && this.parsed.loopClosure

        // add fn using closure
        nue.fn = closure ? Object.create(closure.fn) : {}

        if (closure) {
          if (this.parsed.attributes) {
            this.parsed.attributes.forEach(at => {
              if (at.type === STATE) addStateFromAttribute(closure, nue, at)
              else if (at.type === STATIC_STATE) nue.initState[at.name] = at.placeholder
            })
          }
        }

        // now that nue is ready, run the component
        runComponent(nue, component)

        // now that $, lifecycles, fn, etc are filled with component definition,

        // process slots
        if (this.childNodes) this.childNodes.forEach(n => processNode(nue, n))

        // process shadow dom
        buildShadowDOM(nue)
      }

      // if the connection change is due to reordering, no need to connect and disconnect
      if (nue.ignoreConnectionChange) return

      // run mount callbacks first and then connect the DOM to state
      // this allows state to set by onMount callbacks to be used directly by the DOM without having to initialize with null values
      runEvent(nue, 'onMount')

      // connect shadow DOM and slots to the component state
      connect(this.shadowRoot, true)
      connect(this)
    }

    disconnectedCallback () {
      const nue = this.nue
      // if the connection change is due to reordering, no need to connect and disconnect
      if (nue.ignoreConnectionChange) return

      // disconnect the shadow DOM and slots from component state
      disconnect(this.shadowRoot, true)
      disconnect(this, true)

      // run onDestroy callbacks
      runEvent(nue, 'onDestroy')
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
