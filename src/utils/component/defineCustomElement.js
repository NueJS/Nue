import { data } from '../data'
import { createElement } from '../node/dom.js'
import { reactify } from '../reactivity/reactify.js'
import { subscribeNode, unsubscribeNode } from '../subscription/node.js'
import { dashify } from '../string/dashify.js'
import { flushArray, upper } from '../others.js'
import { runComponent } from './runComponent.js'
import { addHooks } from './hooks.js'
import { buildShadowDOM } from './buildShadowDOM.js'
import { hydrate } from '../hydration/hydrate.js'
import { parse } from 'utils/parse/parseNode.js'
// import processAttributes from '../process/attributes/processAttributes.js'

/**
 * defines a custom element using the compFn function
 * @param {Function} compFn
 */
export const defineCustomElement = (compFn) => {
  const { _components, _config } = data
  const compFnName = compFn.name

  // return if already defined
  if (compFnName in _components) return
  _components[compFnName] = compFn

  /** @type {HTMLTemplateElement}*/
  let componentTemplateElement

  class NueComp extends HTMLElement {
    constructor () {
      super()
      /** @type {Comp} */
      // @ts-expect-error
      const comp = this

      comp._compFnName = compFnName

      // refs of child nodes with *ref='ref-name' attribute
      comp.refs = {}

      // subscription tree which contains the callbacks stored at various dependency paths
      comp._subscriptions = { _itself: new Set() }

      comp._batches = /** @type {[Set<Function>, Set<Function>]}*/([new Set(), new Set()])

      // Array of mutation info that happened in a batch
      comp._mutations = []

      // array of callbacks that should be run after some process is done
      comp._deferredWork = []

      // nodes that are using the state
      comp._nodesUsingLocalState = new Set()

      // nodes that are using the closure state
      comp._nodesUsingClosureState = new Set()

      if (!comp._prop$) comp._prop$ = {}

      addHooks(comp)
    }

    connectedCallback () {
      /** @type {Comp} */
      // @ts-expect-error
      const comp = this

      if (comp._moving) return

      comp._manuallyDisconnected = false

      // when compFn is being connected for the first time
      if (!comp.shadowRoot) {
        const { parent } = comp

        // create fn
        comp.fn = parent ? Object.create(parent.fn) : {}

        // create $
        comp.$ = reactify(comp, [])

        // process attributes
        // do this only on looped components - right ?
        // if (comp._parsedInfo) {
        //   const { _attributes } = comp._parsedInfo
        //   if (_attributes) processAttributes(comp, comp, _attributes)
        // }

        const [templateString, cssString, childComponents] = runComponent(comp, compFn, !!componentTemplateElement)

        // do this only once per compFn ------------------
        if (!componentTemplateElement) {
          /** @type {Record<string, string>} */
          let childCompNodeNames = {}
          if (childComponents) {
            childCompNodeNames = childComponents.reduce(
              /**
               * use the upper case dashed name of child function as key and save the original name
               * @param {Record<string, string>} acc
               * @param {Function} child
               * @returns {Record<string, string>}
               */
              (acc, child) => {
                const { name } = child
                acc[dashify(upper(name))] = name
                return acc
              }, {})
          }

          // create componentTemplateElement using template, style, and defaultStyle
          componentTemplateElement = /** @type {HTMLTemplateElement}*/(createElement('template'))
          componentTemplateElement.innerHTML =
          templateString +
          `<style default> ${_config.defaultStyle} </style>` +
          '<style scoped >' + cssString + '</style>'

          // parse the template and create componentTemplateElement which has all the parsed info

          /** @type {Function[]} */
          const deferred = []
          parse(componentTemplateElement.content, childCompNodeNames, deferred, comp)
          flushArray(deferred)

          // define all child components
          childComponents.forEach(defineCustomElement)
        }

        // hydrate DOM and shadow DOM
        // TODO: process should be able to take the fragment node
        comp.childNodes.forEach(node => hydrate(node, comp))
        buildShadowDOM(comp, componentTemplateElement)

        // connect all nodes using local state
        comp._nodesUsingLocalState.forEach(subscribeNode)

        // subscribe node, so that it's attributes are in sync
        subscribeNode(comp)
      }

      // only connect nodes that were previously disconnected (nodes using closure state)
      else {
        comp._nodesUsingClosureState.forEach(subscribeNode)
      }

      comp._hookCbs._onMount.forEach(cb => cb())
    }

    disconnectedCallback () {
      /** @type {Comp} */
      // @ts-expect-error
      const comp = this

      if (comp._manuallyDisconnected) return
      if (comp._moving) return

      comp._hookCbs._onDestroy.forEach(cb => cb())

      // only disconnect nodes that are using closure, no need to disconnect nodes that use local state only
      comp._nodesUsingClosureState.forEach(unsubscribeNode)

      // unsubscribeNode(comp) (not needed ?)
    }
  }

  // define current compFn and then it's children
  customElements.define(dashify(compFnName), NueComp)
}
