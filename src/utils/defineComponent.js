import { connect, disconnect } from './connection/recursive.js'
import runScript from './runScript.js'
import addLifecycles, { runEvent } from './lifecycle.js'
import buildShadowDOM from './buildShadowDOM.js'
import processNode from './process/processNode.js'
import globalInfo from './globalInfo.js'
import addStateFromAttribute from './addStateFromAttribute.js'
import { FUNCTION_ATTRIBUTE, STATE, STATIC_STATE } from './constants.js'
import { upper } from './others.js'
import reactify from './reactivity/reactify.js'
import { TARGET } from './symbols.js'
import { createElement } from './node/dom.js'
import parseTemplate from './parse/parseTemplate'

function defineComponent (component) {
  const { name, template = '', script, style = '', children } = component

  // if the component is already defined, do nothing
  if (globalInfo.definedComponents[name]) return

  // create hash from component.children array for constant time checking to decide if the node is a component or not
  const childrenHash = {}
  if (children) {
    children.forEach(childComp => {
      childrenHash[upper(childrenHash.name)] = true
    })
  }

  component.childrenHash = childrenHash

  // create templateNode using template, style, and defaultStyle
  const templateNode = createElement('template')
  const defaultStyle = globalInfo.defaultStyle && `<style default> ${globalInfo.defaultStyle} </style>`
  templateNode.innerHTML = '<!-- template -->' + template + '<!-- style -->' + defaultStyle + '<style scoped >' + style + '</style>'

  // parse the template and create templateNode which has all the parsed info
  parseTemplate(templateNode, component)

  // node object contains the data that is common for all instances
  const common = { templateNode, component }

  globalInfo.definedComponents[name] = common

  class Nue extends HTMLElement {
    // construct basic nue structure
    constructor () {
      super()
      const nue = this.nue = {
        node: this,
        refs: {},
        actions: {},
        deps: { $: new Map() },
        fn: {},
        queue: {
          // batched callbacks
          stateReady: new Map(),
          computed: new Map(),
          dom: new Map()
        },
        common,
        deferred: [],
        initState: {},
        reordering: false
      }

      addLifecycles(nue)
    }

    connectedCallback () {
      const node = this
      const nue = node.nue

      // if the connection change is due to reordering, no need to connect and disconnect
      if (nue.reordering) return

      // node check is added to make sure, processing only happens once
      // and not again when component is disconnected and connected back
      if (!node.shadowRoot) {
        const { parsed } = node
        if (parsed) {
          const { closure, loopClosure, attributes } = parsed

          // if the closure is available, inherit fn
          if (closure) {
            nue.closure = closure // @todo move this to node maybe so we don't have to save it in parsed and nue ?
            nue.fn = Object.create(closure.fn)

            if (attributes) {
              attributes.forEach(at => {
                if (at.type === STATE) addStateFromAttribute(closure, nue, at)
                else if (at.type === STATIC_STATE) nue.initState[at.name] = at.placeholder
                else if (at.type === FUNCTION_ATTRIBUTE) nue.fn[at.name] = nue.closure.fn[at.placeholder]
              })
            }
          }

          // @todo save it in node maybe so don't have to save it in two places ?
          if (loopClosure) {
            nue.loopClosure = loopClosure
          }
        }

        // create reactive state
        const closure$ = nue.closure && nue.closure.$
        nue.$ = reactify(nue, nue.initState, [], closure$)
        nue.$Target = nue.$[TARGET]

        // run script method
        if (script) runScript(nue, script)

        // process childNodes (DOM) and shadow DOM
        node.childNodes.forEach(n => processNode(nue, n))
        buildShadowDOM(nue)
      }

      // run mount callbacks first and then connect the DOM to state
      // node allows state to set by onMount callbacks to be used directly by the DOM without having to initialize with null values
      runEvent(nue, 'onMount')

      // connect shadow DOM and slots to the component state
      connect(node.shadowRoot, true)
      connect(node)
    }

    disconnectedCallback () {
      const node = this
      const nue = node.nue
      // do nothing, if the connection change is due to reordering
      if (nue.reordering) return

      // run onDestroy callbacks
      runEvent(nue, 'onDestroy')

      // disconnect the shadow DOM and slots from component state
      disconnect(node.shadowRoot, true)
      disconnect(node, true)
    }
  }

  // define current component and then it's children
  customElements.define(name, Nue)
  if (children) children.forEach(defineComponent)
}

export default defineComponent
