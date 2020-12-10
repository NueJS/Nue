// import fetchComponents from './fetchComponents.js'
import modes from '../reactivity/modes.js'
import reactify from '../reactivity/reactify.js'
import html from '../string/html.js'
// import process_fn from '../string/fn.js'
import memoize_template from '../memoize/template.js'

function setup_processing (component) {
  this.$ = reactify.call(this, this.props || {})
  const handle = this.handle
  const on = this.on
  const refs = this.memo.refs
  const actions = this.actions
  let _html
  // _css

  const invoke_component = () => {
    modes.reactive = false
    modes.no_overrides = true
    component({ _: this.$, handle, on, refs, html: _html, actions, fn: this.fn })
    modes.reactive = true
    modes.no_overrides = false
  }

  // if memoized already, don't process template
  if (this.memo.template) {
    _html = () => {}
    // _css = () => {}
    invoke_component(false)
  }

  else {
    _html = html.bind(this)
    // _css = css.bind(this)
    this.memo.template = document.createElement('template')
    invoke_component(true)
    memoize_template.call(this)
  }
}

export default setup_processing
