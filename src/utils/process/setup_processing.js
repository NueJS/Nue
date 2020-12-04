// import fetchComponents from './fetchComponents.js'
import reactify from '../reactivity/reactify.js'
import processTemplate from './process/processTemplate.js'

function setup_processing (component) {
  const $ = reactify.call(this, this.props || {})
  const handle = this.handle
  const on = this.on
  const refs = this.memo.refs
  const actions = this.actions

  const invoke_component = (processHTML) => {
    $.__setDisableOnChange__(true)
    $.__setInitiateMode__(true)
    const _html = processHTML ? html.bind(this) : () => {}
    component({ $, handle, on, refs, html: _html, actions })
    $.__setInitiateMode__(false)
    $.__setDisableOnChange__(false)
  }

  if (this.memo.template) {
    invoke_component(false)
  } else {
    this.memo.template = document.createElement('template')
    invoke_component(true)
    processTemplate.call(this)
  }

  this.$ = $
}

// process tagged template literal
// does nothing extra, just concatenates the strings with expressions just like how it would be done
// this is just for better DX ( clean syntax and code highlighting)
// can add some feature in future where using an expression can do something special
function html (strings, ...exprs) {
  let str = ''
  let value
  for (let i = 0; i < strings.length; i++) {
    value = exprs[i]
    str += strings[i] + (value === undefined ? '' : value)
  }

  this.memo.template.innerHTML = str
}

export default setup_processing
