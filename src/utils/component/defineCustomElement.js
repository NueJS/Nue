import { ITSELF } from '../../constants.js'
import data from '../data'
import { createElement } from '../node/dom.js'
import parseTemplate from '../parse/parseTemplate'
import reactify from '../reactivity/reactify.js'
import { subscribeNode, unsubscribeNode } from '../subscription/node.js'
import { dashify } from '../string/dashify.js'
import { upper } from '../others.js'
import runComponent from './runComponent.js'
import addLifecycles from './lifecycle.js'
import buildShadowDOM from './buildShadowDOM.js'
// import process from '../hydration/hydrate.js'
// import processAttributes from '../process/attributes/processAttributes.js'

/**
 * defines a custom element using the compFn function
 * @param {Function} compFn
 */
const defineCustomElement = (compFn) => {
  const { __components, __config } = data

  // use the function's name as the compFn's name
  const { name } = compFn

  // return early if the compFn with this name is already defined
  if (name in __components) return
  __components[name] = compFn

  /** @type {HTMLTemplateElement}*/
  let componentTemplateElement

  class NueComp extends HTMLElement {
    constructor () {
      super()
      /** @type {import('types/dom').Comp} */
      // @ts-expect-error
      const comp = this

      comp.__compFnName = name

      // refs of child nodes with *ref='ref-name' attribute
      comp.refs = {}

      // subscription tree which contains the callbacks stored at various dependency paths
      comp.__subscriptions = { [ITSELF]: new Set() }

      // @ts-expect-error
      comp.__batches = [new Set(), new Set()]

      // Array of mutation info that happened in a batch
      comp.__mutations = []

      // array of callbacks that should be run after some process is done
      comp.__deferredWork = []

      // nodes that are using the state
      comp.__nodesUsingLocalState = new Set()

      // nodes that are using the closure state
      comp.__nodesUsingClosureState = new Set()

      if (!comp.__prop$) comp.__prop$ = {}

      addLifecycles(comp)
    }

    connectedCallback () {
      /** @type {import('types/dom').Comp} */
      // @ts-expect-error
      const comp = this

      if (comp.__moving) return

      comp.__manuallyDisconnected = false

      // when compFn is being connected for the first time
      if (!comp.shadowRoot) {
        const { parent } = comp

        // create fn
        comp.fn = parent ? Object.create(parent.fn) : {}

        // create $
        comp.$ = reactify(comp, [])

        // process attributes
        // do this only on looped components - right ?
        // if (comp.__parsedInfo) {
        //   const { __attributes } = comp.__parsedInfo
        //   if (__attributes) processAttributes(comp, comp, __attributes)
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
          // @ts-ignore
          componentTemplateElement = createElement('template')
          componentTemplateElement.innerHTML = templateString + `<style default> ${__config.defaultStyle} </style>` + '<style scoped >' + cssString + '</style>'

          // parse the template and create componentTemplateElement which has all the parsed info
          parseTemplate(comp, componentTemplateElement, childCompNodeNames)

          childComponents.forEach(defineCustomElement)
        }

        // process childNodes (DOM) and shadow DOM
        // TODO: process should be able to take the fragment node
        comp.childNodes.forEach(node =>
          // @ts-ignore
          process(comp, node)
        )
        buildShadowDOM(comp, componentTemplateElement)

        // connect all nodes using local state
        comp.__nodesUsingLocalState.forEach(subscribeNode)

        // subscribe node, so that it's attributes are in sync
        subscribeNode(comp)
      }

      // only connect nodes that were previously disconnected (nodes using closure state)
      else {
        comp.__nodesUsingClosureState.forEach(subscribeNode)
      }

      comp.__lifecycleCallbacks.__onMount.forEach(cb => cb())
    }

    disconnectedCallback () {
      /** @type {import('types/dom').Comp} */
      // @ts-expect-error
      const comp = this

      if (comp.__manuallyDisconnected) return
      if (comp.__moving) return

      // run onDestroy callbacks
      comp.__lifecycleCallbacks.__onDestroy.forEach(cb => cb())

      // only disconnect nodes that are using closure, no need to disconnect nodes that use local state only
      comp.__nodesUsingClosureState.forEach(unsubscribeNode)

      // unsubscribeNode(comp) (not needed ?)
    }
  }

  // define current compFn and then it's children
  customElements.define(dashify(name), NueComp)
}

export default defineCustomElement
