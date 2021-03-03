import runScript from './runScript.js'
import addLifecycles, { runEvent } from './lifecycle.js'
import buildShadowDOM from './buildShadowDOM.js'
import processNode from '../process/processNode.js'
import stats from '../stats'
import { upper } from '../others.js'
import { createElement } from '../node/dom.js'
import parseTemplate from '../parse/parseTemplate'
import setupNue from './setupNue.js'
import disconnectNode from '../connection/disconnectNode.js'
import connectNode from '../connection/connectNode.js'
import { BATCH_INFO, BEFORE_DOM_BATCH, DEFERRED_WORK, DOM_BATCH, IGNORE_DISCONNECT, ON_DESTROY_CBS, ON_MOUNT_CBS } from '../constants.js'

const defineCustomElement = (compObj) => {
  const { name, template = '', script, style = '', children } = compObj
  const { components, config } = stats
  // return if already defined
  if (name in components) return

  components[name] = compObj

  // create hash from compObj.children array for constant time checking to decide if the node is a compObj or not

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
      compNode.refs = {}
      compNode.subscriptions = { $: new Set() }
      // batches
      compNode[BEFORE_DOM_BATCH] = new Set()
      compNode[DOM_BATCH] = new Set()

      compNode[BATCH_INFO] = []
      compNode[DEFERRED_WORK] = []
      compNode.templateNode = templateNode
      compNode.component = compObj
      compNode.processedNodes = new Set()
      compNode.nodesUsingClosure = new Set()

      if (!compNode.init$) compNode.init$ = {}

      addLifecycles(compNode)
    }

    connectedCallback () {
      const compNode = this
      // if the connection change is due to reordering, ignore
      if (compNode.reordering) return

      // if first time connecting
      if (!compNode.shadowRoot) {
        setupNue(compNode)
        if (script) runScript(compNode, script)
        // process childNodes (DOM) and shadow DOM
        compNode.childNodes.forEach(n => processNode(compNode, n))
        buildShadowDOM(compNode)
        // connect all processedNodes
        compNode.processedNodes.forEach(connectNode)
      } else {
        // only connect nodes that were previously disconnected
        compNode.nodesUsingClosure.forEach(connectNode)
      }

      runEvent(compNode, ON_MOUNT_CBS)
      compNode[IGNORE_DISCONNECT] = false
    }

    disconnectedCallback () {
      const compNode = this
      // if disconnectedCallback was manually called earlier, no need to call it again when node is removed
      if (compNode[IGNORE_DISCONNECT]) return
      // do nothing, if the connection change is due to reordering
      if (compNode.reordering) return
      // run onDestroy callbacks
      runEvent(compNode, ON_DESTROY_CBS)
      // only disconnect nodes that are using closure, no need to disconnect nodes that use local state only
      compNode.nodesUsingClosure.forEach(disconnectNode)
    }
  }

  // define current compObj and then it's children
  customElements.define(name, NueComp)
  if (children) children.forEach(defineCustomElement)
}

export default defineCustomElement
