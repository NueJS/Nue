// import fetchComponents from './fetchComponents.js'
import modes from '../reactivity/modes.js'
import reactify from '../reactivity/reactify.js'
import html from '../string/html.js'
import process_template from './template.js'

function setup_processing (component) {
  const $ = reactify.call(this, this.props || {})
  const handle = this.handle
  const on = this.on
  const refs = this.memo.refs
  const actions = this.actions
  let _html

  const invoke_component = (processHTML) => {
    modes.reactive = false
    modes.no_overrides = true
    component({ $, handle, on, refs, html: _html, actions })
    modes.reactive = true
    modes.no_overrides = false
  }

  // if memoized already, don't process template
  if (this.memo.template) {
    _html = () => {}
    invoke_component(false)
  }

  else {
    _html = html.bind(this)
    this.memo.template = document.createElement('template')
    invoke_component(true)
    process_template.call(this)
  }

  this.$ = $
}

export default setup_processing
