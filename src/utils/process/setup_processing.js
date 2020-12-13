// import fetchComponents from './fetchComponents.js'
import modes from '../reactivity/modes.js'
import reactify from '../reactivity/reactify.js'
import html from '../string/html.js'
// import process_fn from '../string/fn.js'
import memoTemplate from '../memoize/template.js'

function setup_processing (component) {
  this.$ = reactify.call(this, this.props || {})

  let _html

  const invoke_component = () => {
    modes.reactive = false
    modes.noOverride = true
    component({
      $: this.$,
      on: this.on,
      refs: this.refs,
      html: _html,
      // actions: this.actions,
      fn: this.fn,
      component: this
    })
    modes.reactive = true
    modes.noOverride = false
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
    memoTemplate.call(this)
  }
}

export default setup_processing
