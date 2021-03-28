import { createElement } from '../../node/dom'
import { data } from '../../data'
import { errorOverlayHTML } from './errorOverlayHTML'

/**
 * show error overlay
 * @param {NueError} error
 */

export const showErrorOverlay = (error) => {
  // if already showing error, return
  if (data._errorThrown) return
  class errorOverlay extends HTMLElement {
    constructor () {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.innerHTML = errorOverlayHTML
    }

    connectedCallback () {
      const shadowRoot = /** @type {ShadowRoot}*/(this.shadowRoot)

      const closeButton = /** @type {Element} */(shadowRoot.querySelector('.parsed-error__close-icon'))
      closeButton.addEventListener('click', () => {
        this.remove()
      })
    }
  }

  window.customElements.define('nue-error-overlay', errorOverlay)

  const overlay = /** @type {HTMLElement} */(createElement('nue-error-overlay'))
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
