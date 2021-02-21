import modes from './reactivity/modes.js'
import reactify from './reactivity/reactify.js'
import templateTag from './string/templateTag.js'
import parseTemplate from './parse/parseTemplate.js'
import { TARGET } from './symbols.js'
import { createElement } from './node/dom.js'
import addDefaultStyles from './addDefaultStyle.js'

function runComponent (comp, component) {
  const { closure } = comp
  const closure$ = closure && closure.$

  // set the state and target
  comp.$ = reactify(comp, comp.initState, [], closure$)
  comp.$Target = comp.$[TARGET]

  const invokeComp = (processed) => {
    modes.reactive = false
    modes.noOverride = true

    const template = (...args) => {
      if (!processed) {
        comp.template.innerHTML = templateTag(...args)
      }
    }

    component({
      $: comp.$,
      refs: comp.refs,
      template,
      fn: comp.fn,
      self: comp.node,
      ...comp.events
    })

    modes.reactive = true
    modes.noOverride = false
  }

  // if template is processed already
  if (comp.template) {
    invokeComp(true)
  }

  else {
    comp.template = createElement('template')
    invokeComp(false)
    parseTemplate(comp)
    addDefaultStyles(comp.template)
  }
}

export default runComponent
