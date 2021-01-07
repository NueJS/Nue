import globalInfo from '../globalInfo.js'
import modes from '../reactivity/modes.js'
import reactify from '../reactivity/reactify.js'
import html from '../string/html.js'
import populateSlots from './populateSlots.js'
import sweetifyTemplate from './sweetifyTemplate.js'

function preprocess (comp, component) {
  // console.log('initial props: ', comp.stateProps);
  [comp.$, comp.$Target] = reactify(comp, comp.stateProps || {})

  const invokeComp = (processed) => {
    modes.reactive = false
    modes.noOverride = true

    component({
      $: comp.$,
      on: comp.on,
      refs: comp.refs,
      html: processed ? () => {} : html.bind(comp),
      fn: comp.fn,
      component: comp,
      props: { ...comp.stateProps, ...comp.fnProps }
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
    const style = comp.memo.template.content.querySelector('style')
    const defaultStyle = document.createElement('style')
    defaultStyle.setAttribute('sweet-default', '')
    defaultStyle.textContent = globalInfo.defaultStyle
    if (style) {
      style.before(defaultStyle)
    } else {
      comp.memo.template.content.lastChild.after(defaultStyle)
    }
    populateSlots(comp)
    sweetifyTemplate(comp)
  }
}

export default preprocess
