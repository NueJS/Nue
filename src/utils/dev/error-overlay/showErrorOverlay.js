import { createElement } from '../../node/dom'
import { data } from '../../data'
import { errorOverlayHTML } from './errorOverlayHTML'

/**
 * show error overlay
 * @param {NueError} error
 * @param {{ filename: string, lineno: string, colno: string }} location
 */

export const showErrorOverlay = (error, location) => {
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
  const code = /** @type {HTMLElement}*/(root.querySelector('.code'))
  const title = /** @type {HTMLElement}*/(root.querySelector('.title'))
  const fileLink = /** @type {HTMLElement}*/(root.querySelector('.file'))

  if (error.issue) {
    title.textContent = error.name
    message.textContent = `${error.issue}\n\n${error.fix}`
    code.textContent = error.code
  }

  else {
    title.textContent = error.constructor.name
    message.textContent = error.message
    code.textContent = error.stack
  }

  data._errorThrown = true
}
