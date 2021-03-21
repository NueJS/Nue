import runScript from './runScript.js'
import addLifecycles, { runEvent } from './lifecycle.js'
import buildShadowDOM from './buildShadowDOM.js'
import processNode from '../process/processNode.js'
import stats from '../stats'
import { createElement } from '../node/dom.js'
import parseTemplate from '../parse/parseTemplate'
import { BATCH_INFO, BEFORE_DOM_BATCH, DEFERRED_WORK, DOM_BATCH, IGNORE_DISCONNECT, INIT_$, ITSELF, NODES_USING_CLOSURE, ON_DESTROY_CBS, ON_MOUNT_CBS, PARSED, NODES_USING_STATE, REORDERING, SUBSCRIPTIONS } from '../constants.js'
import processAttributes from '../process/attributes/processAttributes.js'
import reactify from '../reactivity/reactify.js'
import { subscribeNode, unsubscribeNode } from '../subscription/node.js'
import { dashify } from '../string/dashify.js'
import { upper } from '../others.js'

/**
 * defines a custom element using the component function
 * @param {Function} component
 */

const defineCustomElement = (component) => {
  const { components, config } = stats

  // use the function's name as the component's name
  const { name } = component

  // return early if the component with this name is already defined
  if (name in components) return
  components[name] = component

  /** @type {HTMLTemplateElement}*/
  let componentTemplateElement

  class NueComp extends HTMLElement {
    constructor () {
      super()
      /** @type {import('../types').compNode} */
      // @ts-expect-error
      const compNode = this
      // name of the custom element
      compNode.name = name
      // refs of child nodes with *ref='ref-name' attribute
      compNode.refs = {}
      // subscription tree which contains the callbacks stored at various dependency paths
      compNode[SUBSCRIPTIONS] = { [ITSELF]: new Set() }

      // batches
      compNode[BEFORE_DOM_BATCH] = new Set()
      compNode[DOM_BATCH] = new Set()

      // Array of mutation info that happened in a flush
      compNode[BATCH_INFO] = []

      // array of callbacks that should be run after some process is done
      compNode[DEFERRED_WORK] = []

      // nodes that are using the state
      compNode[NODES_USING_STATE] = new Set()

      // nodes that are using the closure state
      compNode[NODES_USING_CLOSURE] = new Set()

      if (!compNode[INIT_$]) compNode[INIT_$] = {}

      addLifecycles(compNode)
    }

    connectedCallback () {
      /** @type {import('../types').compNode} */
      // @ts-expect-error
      const compNode = this

      // if the connection change is due to reordering, ignore
      if (compNode[REORDERING]) return

      // do not ignore disconnect
      compNode[IGNORE_DISCONNECT] = false

      // when component is being connected for the first time
      if (!compNode.shadowRoot) {
        const { closure } = compNode
        // add fn
        compNode.fn = closure ? Object.create(closure.fn) : {}
        // add $
        const closure$ = closure && closure.$
        compNode.$ = reactify(compNode, compNode[INIT_$], [], closure$)

        // process attributes
        if (compNode[PARSED]) {
          const { attributes } = compNode[PARSED]
          if (attributes) processAttributes(compNode, compNode, attributes)
        }

        const [templateString, cssString, childComponents] = runScript(compNode, component, !!componentTemplateElement)

        // do this only once per component ------------------
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
          componentTemplateElement.innerHTML = templateString + `<style default> ${config.defaultStyle} </style>` + '<style scoped >' + cssString + '</style>'

          // parse the template and create componentTemplateElement which has all the parsed info
          parseTemplate(compNode, componentTemplateElement, childCompNodeNames)

          childComponents.forEach(defineCustomElement)
        }

        // process childNodes (DOM) and shadow DOM
        // TODO: processNode should be able to take the fragment node
        compNode.childNodes.forEach(node =>
          // @ts-ignore
          processNode(compNode, node)
        )
        buildShadowDOM(compNode, componentTemplateElement)

        // connect all nodes using state (local + closure)
        compNode[NODES_USING_STATE].forEach(subscribeNode)

        // subscribe node, so that it's attributes are in sync
        subscribeNode(compNode)
      }

      // only connect nodes that were previously disconnected (nodes using closure state)
      else {
        compNode[NODES_USING_CLOSURE].forEach(subscribeNode)
      }

      // run onMount callbacks
      runEvent(compNode, ON_MOUNT_CBS, compNode[BATCH_INFO])
    }

    disconnectedCallback () {
      /** @type {import('../types').compNode} */
      // @ts-expect-error
      const compNode = this
      // if disconnectedCallback was manually called earlier, no need to call it again when node is removed
      if (compNode[IGNORE_DISCONNECT]) return

      // do nothing, if the connection change is due to reordering
      if (compNode[REORDERING]) return

      // run onDestroy callbacks
      runEvent(compNode, ON_DESTROY_CBS, compNode[BATCH_INFO])

      // only disconnect nodes that are using closure, no need to disconnect nodes that use local state only
      compNode[NODES_USING_CLOSURE].forEach(unsubscribeNode)

      // unsubscribeNode(compNode) (not needed ?)
    }
  }

  // define current component and then it's children
  customElements.define(dashify(name), NueComp)
}

export default defineCustomElement
