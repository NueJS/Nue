import runScript from './runScript.js'
import addLifecycles, { runEvent } from './lifecycle.js'
import buildShadowDOM from './buildShadowDOM.js'
import processNode from '../process/processNode.js'
import stats from '../stats'
import { upper } from '../others.js'
import { createElement } from '../node/dom.js'
import parseTemplate from '../parse/parseTemplate'
import { BATCH_INFO, BEFORE_DOM_BATCH, DEFERRED_WORK, DOM_BATCH, IGNORE_DISCONNECT, INIT_$, NODES_USING_CLOSURE, ON_DESTROY_CBS, ON_MOUNT_CBS, PARSED, PROCESSED_NODES, REORDERING, SUBSCRIPTIONS } from '../constants.js'
import processAttributes from '../process/attributes/processAttributes.js'
import reactify from '../reactivity/reactify.js'
import { subscribeNode, unsubscribeNode } from '../subscription/node.js'

const defineCustomElement = (compObj) => {
  const { name, template = '', script, style = '', children } = compObj
  const { components, config } = stats
  // return if already defined
  if (name in components) return

  components[name] = compObj

  // set of names that are children
  const childCompNodeNames = new Set(children ? children.map(childCompObj => upper(childCompObj.name)) : [])

  // create templateNode using template, style, and defaultStyle
  const templateNode = createElement('template')
  templateNode.innerHTML = template + `<style default> ${config.defaultStyle} </style>` + '<style scoped >' + style + '</style>'

  // parse the template and create templateNode which has all the parsed info
  parseTemplate(templateNode, childCompNodeNames, name)

  class NueComp extends HTMLElement {
    constructor () {
      super()
      const compNode = this
      compNode.name = name
      compNode.refs = {}

      compNode[SUBSCRIPTIONS] = { $: new Set() }

      // batches
      compNode[BEFORE_DOM_BATCH] = new Set()
      compNode[DOM_BATCH] = new Set()

      compNode[BATCH_INFO] = []
      compNode[DEFERRED_WORK] = []
      compNode[PROCESSED_NODES] = new Set()
      compNode[NODES_USING_CLOSURE] = new Set()

      if (!compNode[INIT_$]) compNode[INIT_$] = {}
      addLifecycles(compNode)
    }

    connectedCallback () {
      const compNode = this
      // if the connection change is due to reordering, ignore
      if (compNode[REORDERING]) return

      // if first time connecting
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

        if (script) runScript(compNode, script)
        // process childNodes (DOM) and shadow DOM
        compNode.childNodes.forEach(n => processNode(compNode, n))
        buildShadowDOM(compNode, templateNode)
        // connect all processedNodes
        compNode[PROCESSED_NODES].forEach(subscribeNode)
        // mark the node as connected so that attributes can be updated
        subscribeNode(compNode)
      } else {
        // only connect nodes that were previously disconnected
        compNode[NODES_USING_CLOSURE].forEach(subscribeNode)
      }

      runEvent(compNode, ON_MOUNT_CBS)
      compNode[IGNORE_DISCONNECT] = false
    }

    disconnectedCallback () {
      const compNode = this
      // if disconnectedCallback was manually called earlier, no need to call it again when node is removed
      if (compNode[IGNORE_DISCONNECT]) return
      // do nothing, if the connection change is due to reordering
      if (compNode[REORDERING]) return
      // run onDestroy callbacks
      runEvent(compNode, ON_DESTROY_CBS)
      // only disconnect nodes that are using closure, no need to disconnect nodes that use local state only
      compNode[NODES_USING_CLOSURE].forEach(unsubscribeNode)
      unsubscribeNode(compNode)
    }
  }

  // define current compObj and then it's children
  customElements.define(name, NueComp)
  if (children) children.forEach(defineCustomElement)
}

export default defineCustomElement
