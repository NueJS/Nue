import fetchComponents from './fetchComponents.js'
import reactify from './reactivity/reactify.js'
import processTemplate from './process/processTemplate.js'

function buildTemplate (component) {
  const $ = reactify.call(this, this.props || {})
  const _ = {}
  const handle = this.handle
  const on = this.on
  const refs = this.config.refs

  const initComponent = () => {
    $.__setDisableOnChange__(true)
    $.__setInitiateMode__(true)
    component({ $, handle, on, refs, _ })
    $.__setInitiateMode__(false)
    $.__setDisableOnChange__(false)
  }

  // if config.template is not created
  if (!this.config.template) {
    initComponent()

    // create a template node
    const template = document.createElement('template')
    const commonStyle = `<style common-styles > ${window.supersweet.commonCSS}</style>`
    template.innerHTML = _.html + commonStyle

    // onetime processing
    processTemplate.call(this, template)

    // fetch needed JS for used components in the template
    fetchComponents(template)

    this.config.template = template
  } else {
    initComponent()
  }

  // add state to component
  this.$ = $
}

export default buildTemplate
