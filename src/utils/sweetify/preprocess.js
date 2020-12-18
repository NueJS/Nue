import modes from '../reactivity/modes.js'
import reactify from '../reactivity/reactify.js'
import html from '../string/html.js'
import sweetifyTemplate from './sweetifyTemplate.js'

function preprocess (component) {
  [this.$, this.$Target] = reactify.call(this, this.stateProps || {})

  let _html

  const invoke_component = () => {
    modes.reactive = false
    modes.noOverride = true

    component({
      $: this.$,
      on: this.on,
      refs: this.refs,
      html: _html,
      fn: this.fn,
      component: this,
      props: { ...this.stateProps, ...this.fnProps }
    })

    modes.reactive = true
    modes.noOverride = false
  }

  // if template is processed already
  if (this.memo.template) {
    _html = () => {}
    invoke_component(false)
  }

  else {
    _html = html.bind(this)
    this.memo.template = document.createElement('template')
    invoke_component(true)
    if (!component.noSweetify) sweetifyTemplate.call(this)
  }
}

export default preprocess
