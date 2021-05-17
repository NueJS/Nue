
import { devTool } from '../../data'
import { createElement } from '../../dom/create'
import { errorOverlayHTML } from './errorOverlayHTML'

/**
 * show error overlay by creating a custom overlay element
 * @param {NueError} error
 */

export const showErrorOverlay = (error) => {

  // if already showing error, return
  if (devTool.errorThrown) return

  window.customElements.define('nue-error-overlay', class extends HTMLElement {
    constructor () {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.innerHTML = errorOverlayHTML
    }

    connectedCallback () {
      const shadowRoot = /** @type {ShadowRoot}*/(this.shadowRoot)

      const closeButton = /** @type {Element} */(shadowRoot.querySelector('.close-icon'))
      closeButton.addEventListener('click', () => {
        this.remove()
      })
    }
  })

  const overlay = /** @type {HTMLElement} */(createElement('nue-error-overlay'))
  document.body.append(overlay)

  const root = /** @type {ShadowRoot}*/ (overlay.shadowRoot)
  const message = /** @type {HTMLElement}*/(root.querySelector('.message'))
  const code = /** @type {HTMLElement}*/(root.querySelector('.code'))
  const title = /** @type {HTMLElement}*/(root.querySelector('.title'))

  // hide the .code if the no code is to be shown
  if (!error.code) {
    code.hidden = true
  }

  if (error.issue) {
    title.textContent = error.name
    message.textContent = `${error.issue}\n\n${error.fix}`
    code.innerHTML = error.code.innerHTML

    const codeError = /** @type {HTMLElement} */(code.querySelector('.error'))
    codeError.tabIndex = 0
    codeError.focus()
  }

  else {
    title.textContent = error.constructor.name
    message.textContent = error.message
    code.textContent = /** @type {string}*/(error.stack)
  }

  devTool.errorThrown = true
}
