import fetchComponents from './fetchComponents.js'
import reactify from './reactivity/reactify.js'
import { processTemplate } from './node.js'

function buildTemplate (component, config) {
  const state = reactify.call(this, this.props || {})
  if (!config.template) {
    let htmlString
    const html = (s) => { htmlString = s[0] }
    component({ state, handle: this.handle, html, on: this.on })

    // create a template node
    const template = document.createElement('template')
    const commonStyle = `<style common-styles > ${window.commonCSS}</style>`
    template.innerHTML = htmlString + commonStyle

    // console.log('content : ', template.content.childNodes.length)
    processTemplate.call(this, template)
    // fetch needed JS for used components in the template
    fetchComponents(template)
    config.template = template
  } else {
    const f = () => {}
    component({ state, handle: this.handle, html: f, on: this.on })
  }
  this.state = state
}

export default buildTemplate
