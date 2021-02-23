import modes from './reactivity/modes.js'
import reactify from './reactivity/reactify.js'
import templateTag from './string/templateTag.js'
import parseTemplate from './parse/parseTemplate.js'
import { TARGET } from './symbols.js'
import { createElement } from './node/dom.js'
import addDefaultStyles from './addDefaultStyle.js'
import transformTemplate from './string/transformTemplate.js'

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
      // if the template is not processed, template function parses the string else it does nothing
      if (!processed) {
        nue.templateHTML = templateTag(...args)
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

  // if template is parsed already
  if (nue.template) {
    invokeComp(true)
  }

  // if the template is not parsed yet
  else {
    invokeComp(false)
    transformTemplate(nue)
    nue.template = createElement('template')
    nue.template.innerHTML = nue.templateHTML
    parseTemplate(nue)
    addDefaultStyles(nue.template)
  }
}

export default runComponent
