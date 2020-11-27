// import addState from './utils/state/addState.js'
import buildShadowDOM from './utils/buildShadowDOM.js'
import reactify from './utils/reactivity/reactify.js'
import fetchComponents from './utils/fetchComponents.js'

function element (compName, component) {
  let template
  class El extends HTMLElement {
    constructor () {
      super()
      window.supersweet.elements[compName] = true
      this.handle = {}
      this.stateDeps = {}
      this.mode = 'open'
      this.computedStateDeps = []
      this.refs = {}
      this.compName = compName
      this.onAddCbs = []
      this.onRemoveCbs = []
      this.on = {
        add: (fn) => this.onAddCbs.push(fn),
        remove: (fn) => this.onRemoveCbs.push(fn),
        change: (fn, deps) => {}
      }

      const state = reactify.call(this, {})

      if (this.props) {
        for (const prop in this.props) {
          state[prop] = this.props[prop]
        }
      }

      if (!template) {
        let htmlString
        const html = (s) => { htmlString = s[0] }
        component({ state, handle: this.handle, html, on: this.on })

        // create a template node
        const tmp = document.createElement('template')
        const commonStyle = `<style common-styles > ${window.commonCSS}</style>`
        tmp.innerHTML = htmlString + commonStyle
        // fetch needed JS for used components in the template
        fetchComponents(tmp)
        template = tmp
      } else {
        // since all the instances will have the same html and css, no need to do anything for html and css
        const f = () => {}
        component({ state, handle: this.handle, html: f, on: this.on })
      }

      this.state = state
      buildShadowDOM.call(this, template)
    }

    connectedCallback () {
      this.onAddCbs.forEach(cb => cb())
    }

    disconnectedCallback () {
      this.onRemoveCbs.forEach(cb => cb())
    }
  }

  customElements.define(compName, El)
}

const nodeUpdated = (textNode) => {
  textNode.parentNode.style.background = '#55efc4'
  setTimeout(() => {
    textNode.parentNode.style.background = null
  }, 300)
}

const supersweet = {
  element,
  showUpdates: true,
  nodeUpdated,
  commonCSS: ':host {display: block;}',
  loadedComponents: {},
  paths: {},
  elements: {}
}

window.supersweet = supersweet
