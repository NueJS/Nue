import addState from './utils/state/addState.js'
import buildShadowDOM from './utils/buildShadowDOM.js'

function loadComponents (template) {
  [...template.content.children].forEach(node => {
    checkNode(node)
    if (node.children) {
      [...node.children].forEach(n => checkNode(n))
    }
  })

  function checkNode (node) {
    const elementName = node.nodeName.toLowerCase()
    const path = window.componentPaths[elementName]
    if (path && !window.loadedComponents[elementName]) {
      window.loadedComponents[elementName] = true
      const script = document.createElement('script')
      script.src = path
      document.head.append(script)
    }
  }
}

function customElement (compName, compObj) {
  const template = document.createElement('template')
  const style = compObj.css ? `<style> ${compObj.css}</style>` : ''
  template.innerHTML = compObj.html.trim() + style
  loadComponents(template)
  class El extends HTMLElement {
    constructor () {
      super()
      this.stateDeps = {}
      this.computedStateDeps = []
      this.compObj = compObj
      this.refs = {}
      this.compName = compName
      addState.call(this)
      buildShadowDOM.call(this, template)
      window.loadedComponents[compName] = true
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

window.customElement = customElement
window.loadedComponents = {

}

window.showNodeUpdates = true
window.textNodeUpdated = (textNode) => {
  textNode.parentNode.style.background = 'yellow'
  setTimeout(() => {
    textNode.parentNode.style.background = null
  }, 300)
}
