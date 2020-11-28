import fetchComponents from './fetchComponents.js'

function buildTemplate (component, state, config) {
  console.log(state)
  if (!config.template) {
    let htmlString
    const html = (s) => { htmlString = s[0] }
    component({ state, handle: this.handle, html, on: this.on })

    // create a template node
    const template = document.createElement('template')
    const commonStyle = `<style common-styles > ${window.commonCSS}</style>`
    template.innerHTML = htmlString + commonStyle

    // fetch needed JS for used components in the template
    fetchComponents(template)
    config.template = template
  } else {
    const f = () => {}
    component({ state, handle: this.handle, html: f, on: this.on })
  }
}

export default buildTemplate
