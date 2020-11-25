import addState from './utils/state/addState.js'
import buildShadowDOM from './utils/buildShadowDOM.js'

function $ (compName, compObj) {
  const template = document.createElement('template')
  const style = compObj.css ? `<style> ${compObj.css}</style>` : ''
  template.innerHTML = compObj.html.trim() + style

  class El extends HTMLElement {
    constructor () {
      super()
      this.stateDeps = { }
      this.computedStateDeps = []
      this.compObj = compObj
      this.refs = {}
      addState.call(this)
      buildShadowDOM.call(this, template)
    }

    connectedCallback () {
      if (compObj.onConnect) compObj.onConnect.call(this)
    }

    disconnectedCallback () {
      if (compObj.onDisconnect) compObj.onDisconnect.call(this)
    }
  }

  customElements.define(compName, El)
}

export default $
