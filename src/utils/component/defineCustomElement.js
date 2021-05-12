import { data } from '../data'
import { subscribeNode, unsubscribeNode } from '../subscription/node.js'
import { dashify } from '../string/dashify.js'
import { addHooks } from './hooks.js'
import { ITSELF } from '../../constants'
import { onFirstConnect } from './connectedCallback/onFirstConnect'
import { createElement } from '../node/dom'
import { initComp } from './connectedCallback/initComp'
import { getChildren } from './getChildren'

/**
 * defines a custom element using the CompClass function
 * @param {NueComp} CompClass
 */
export const defineCustomElement = (CompClass) => {

  const { _definedComponents } = data

  // get the name of CompClass
  const compName = CompClass.name

  // do nothing if a component by this name is already defined
  if (compName in _definedComponents) return

  // else, mark this as defined
  _definedComponents[compName] = CompClass

  const compDef = new CompClass()

  compDef._class = CompClass
  compDef._compName = compName
  compDef._template = /** @type {HTMLTemplateElement}*/(createElement('template'))
  compDef._children = compDef.uses ? getChildren(compDef.uses) : {}

  initComp(compDef)

  // create a custom element for this component
  customElements.define(dashify(compName), class extends HTMLElement {
    constructor () {
      super()

      /** @type {Comp} */
      // @ts-expect-error
      const comp = this

      comp._compName = compName
      comp.refs = {}
      comp._subscriptions = { [ITSELF]: new Set() }
      comp._batches = /** @type {[Set<SubCallBack>, Set<SubCallBack>]}*/([new Set(), new Set()])
      comp._mutations = []
      comp._deferredWork = []
      comp._nodesUsingLocalState = new Set()
      comp._nodesUsingClosureState = new Set()

      if (!comp.fn) comp.fn = comp.parent ? Object.create(comp.parent.fn) : {}
      if (!comp._prop$) comp._prop$ = {}

      addHooks(comp)
    }

    connectedCallback () {
      /** @type {Comp} */
      // @ts-expect-error
      const comp = this

      // do nothing if component is just moving
      if (comp._moving) return

      comp._manuallyDisconnected = false

      const { _nodesUsingLocalState, _nodesUsingClosureState, _eventCbs, shadowRoot } = comp

      // when comp is being connected for the first time
      if (!shadowRoot) {
        onFirstConnect(comp, compDef)

        // connect all nodes using local state
        _nodesUsingLocalState.forEach(subscribeNode)
      }

      else {
        // only connect nodes that were previously disconnected
        // connect all nodes using closure state
        _nodesUsingClosureState.forEach(subscribeNode)
      }

      // after all the connections are done, run the onMount callbacks
      _eventCbs._onMount.forEach(cb => cb())
    }

    disconnectedCallback () {
      /** @type {Comp} */
      // @ts-expect-error
      const comp = this

      const { _eventCbs, _nodesUsingClosureState, _manuallyDisconnected, _moving } = comp

      if (_manuallyDisconnected || _moving) return

      _nodesUsingClosureState.forEach(unsubscribeNode)
      _eventCbs._onDestroy.forEach(cb => cb())
    }
  })

  // define used child components
  if (compDef.uses) compDef.uses.forEach(defineCustomElement)

}
