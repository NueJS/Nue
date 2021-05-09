import { data } from '../data'
import { subscribeNode, unsubscribeNode } from '../subscription/node.js'
import { dashify } from '../string/dashify.js'
import { addHooks } from './hooks.js'
import { ITSELF } from '../../constants'
import { errors } from '../dev/errors/index.js'
import { onFirstConnect } from './connectedCallback/onFirstConnect'
import { createElement } from '../node/dom'

/**
 * defines a custom element using the compFn function
 * @param {CompFn} compFn
 */
export const defineCustomElement = (compFn) => {

  if (_DEV_ && typeof compFn !== 'function') {
    throw errors.component_is_not_a_function(compFn)
  }

  const { _definedComponents, _config } = data

  // get the name of compFn
  const compFnName = compFn.name

  // do nothing if a component by this name is already defined
  if (compFnName in _definedComponents) return

  // else, mark this as defined
  _definedComponents[compFnName] = compFn

  /** @type {CompData} */
  const compData = {
    _parsed: false,
    _template: /** @type {HTMLTemplateElement}*/(createElement('template'))
  }

  // create a custom element
  customElements.define(dashify(compFnName), class extends HTMLElement {
    constructor () {
      super()

      /** @type {Comp} */
      // @ts-expect-error
      const comp = this

      comp._compFnName = compFnName
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

      const { _nodesUsingLocalState, _nodesUsingClosureState, _hookCbs, shadowRoot } = comp

      // when comp is being connected for the first time
      if (!shadowRoot) {
        onFirstConnect(comp, compFn, compData, _config.defaultStyle)

        // connect all nodes using local state
        _nodesUsingLocalState.forEach(subscribeNode)
      }

      // only connect nodes that were previously disconnected
      // connect all nodes using closure state
      else {
        _nodesUsingClosureState.forEach(subscribeNode)
      }

      // after all the connections are done, run the onMount callbacks
      _hookCbs._onMount.forEach(cb => cb())
    }

    disconnectedCallback () {
      /** @type {Comp} */
      // @ts-expect-error
      const comp = this

      const { _hookCbs, _nodesUsingClosureState, _manuallyDisconnected, _moving } = comp

      if (_manuallyDisconnected || _moving) return

      _nodesUsingClosureState.forEach(unsubscribeNode)
      _hookCbs._onDestroy.forEach(cb => cb())
    }
  })
}
