import modes from '../reactivity/modes.js'
import reactify from '../reactivity/reactify.js'
import html from '../string/html.js'
import populateSlots from './populateSlots.js'
import sweetifyTemplate from './sweetifyTemplate.js'

function preprocess (component) {
  [this.$, this.$Target] = reactify.call(this, this.stateProps || {})

  const invoke_component = (processed) => {
    modes.reactive = false
    modes.noOverride = true

    component({
      $: this.$,
      on: this.on,
      refs: this.refs,
      html: processed ? () => {} : html.bind(this),
      fn: this.fn,
      component: this,
      props: { ...this.stateProps, ...this.fnProps }
    })

    modes.reactive = true
    modes.noOverride = false
  }

  // if template is processed already
  if (this.memo.template) {
    invoke_component(true)
  }

  else {
    this.memo.template = document.createElement('template')
    invoke_component(false)
    populateSlots.call(this)
    sweetifyTemplate.call(this)
  }
}

export default preprocess
