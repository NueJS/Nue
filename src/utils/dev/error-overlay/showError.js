import { createElement } from '../../node/dom'
import data from '../../data'
import html from './html'

/**
 * show error overlay
 * @param {{ message: string, fix: string, compName: string }} error
 */

const showErrorOverlay = (error) => {
  // if already showing error, return
  if (data._errorThrown) return
  class errorOverlay extends HTMLElement {
    constructor () {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.innerHTML = html
    }

    connectedCallback () {
      const shadowRoot = this.shadowRoot
      /** @type {Element} */
      // @ts-ignore
      const closeButton = shadowRoot.querySelector('.parsed-error_close-icon')
      closeButton.addEventListener('click', () => {
        this.remove()
      })
    }
  }

  window.customElements.define('nuejs-error-overlay', errorOverlay)

  const overlay = /** @type {HTMLElement} */(createElement('nuejs-error-overlay'))
  document.body.append(overlay)

  const root = /** @type {ShadowRoot}*/ (overlay.shadowRoot)
  const message = /** @type {HTMLElement}*/(root.querySelector('.message'))
  const title = /** @type {HTMLElement}*/(root.querySelector('.title'))

  if (error.compName) {
    title.textContent = `error in ${error.compName}`
    const errorMessage = `${error.message}\n\n${error.fix || ''}`
    message.textContent = errorMessage
  }

  else {
    title.textContent = error.constructor.name
    message.textContent = error.message
  }

  data._errorThrown = true
}

export default showErrorOverlay
