import globalInfo from '../globalInfo.js'
import modes from '../reactivity/modes.js'
import reactify from '../reactivity/reactify.js'
import templateTag from '../string/templateTag.js'
import populateSlots from './populateSlots.js'
import sweetifyTemplate from './sweetifyTemplate.js'

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

function preprocess (comp, component) {
  [comp.$, comp.$Target] = reactify(comp, (comp.self.sweet && comp.self.sweet.stateProps) || {})

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
      component: comp,
      props: { ...comp.stateProps, ...comp.fnProps },
      ...comp.lifecycles
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
    populateSlots(comp)
    sweetifyTemplate(comp)
    addDefaultStyles(comp.memo.template)
  }
}

export default preprocess
