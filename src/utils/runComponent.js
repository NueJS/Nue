import modes from './reactivity/modes.js'
import reactify from './reactivity/reactify.js'
import templateTag from './string/templateTag.js'
import parseTemplate from './parse/parseTemplate.js'
import { TARGET } from './symbols.js'
import { createElement } from './node/dom.js'
import addDefaultStyles from './addDefaultStyle.js'

function runComponent (nue, component) {
  const { closure } = nue
  const closure$ = closure && closure.$

  // set the state and target
  nue.$ = reactify(nue, nue.initState, [], closure$)
  nue.$Target = nue.$[TARGET]

  const invokeComp = (processed) => {
    modes.reactive = false
    modes.noOverride = true

    const template = (...args) => {
      if (!processed) {
        nue.template.innerHTML = templateTag(...args)
      }
    }

    component({
      $: nue.$,
      refs: nue.refs,
      template,
      fn: nue.fn,
      self: nue.node,
      ...nue.events,
      events: nue.events
    })

    modes.reactive = true
    modes.noOverride = false
  }

  // if template is processed already
  if (nue.template) {
    invokeComp(true)
  }

  else {
    nue.template = createElement('template')
    invokeComp(false)
    parseTemplate(nue)
    addDefaultStyles(nue.template)
  }
}

export default runComponent
