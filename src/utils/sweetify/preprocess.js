import globalInfo from '../globalInfo.js'
import modes from '../reactivity/modes.js'
import reactify from '../reactivity/reactify.js'
import template from '../string/template.js'
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
  // console.log('initial props: ', comp.stateProps);
  [comp.$, comp.$Target] = reactify(comp, comp.stateProps || {})

  const invokeComp = (processed) => {
    modes.reactive = false
    modes.noOverride = true

    component({
      $: comp.$,
      refs: comp.refs,
      template: processed ? () => {} : template.bind(comp),
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

    // add default styles in component
    addDefaultStyles(comp.memo.template)
  }
}

export default preprocess
