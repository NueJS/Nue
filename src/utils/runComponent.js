import globalInfo from './globalInfo.js'
import modes from './reactivity/modes.js'
import reactify from './reactivity/reactify.js'
import templateTag from './string/templateTag.js'
import parseTemplate from './parse/parseTemplate.js'
import { TARGET } from './symbols.js'

const addDefaultStyles = (template) => {
  const { content } = template
  const style = content.querySelector('style')
  const defaultStyle = document.createElement('style')
  defaultStyle.setAttribute('default-styles', '')
  defaultStyle.textContent = globalInfo.defaultStyle
  if (style) {
    style.before(defaultStyle)
  } else {
    content.lastChild.after(defaultStyle)
  }
}

function runComponent (comp, component) {
  const init = (comp.node.parsed && comp.node.parsed.stateProps) || {}
  const closure$ = comp.closure && comp.closure.$
  comp.$ = reactify(comp, init, [], closure$)
  comp.$Target = comp.$[TARGET]

  const invokeComp = (processed) => {
    modes.reactive = false
    modes.noOverride = true

    const template = (...args) => {
      if (!processed) {
        comp.memo.template.innerHTML = templateTag(...args)
      }
    }

    component({
      $: comp.$,
      refs: comp.refs,
      template,
      fn: comp.fn,
      self: comp.node,
      // component: comp,
      props: comp.node.parsed && comp.node.parsed.stateProps,
      ...comp.events
    })

    modes.reactive = true
    modes.noOverride = false
  }

  // if template is processed already
  if (comp.memo.template) {
    invokeComp(true)
  }

  else {
    comp.memo.template = document.createElement('template')
    invokeComp(false)
    parseTemplate(comp)
    addDefaultStyles(comp.memo.template)
  }
}

export default runComponent
