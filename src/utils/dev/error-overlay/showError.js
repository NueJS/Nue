import { createElement } from '../../node/dom'
import stats from '../../stats'
import html from './html'

/**
 * show error overlay
 * @param {{ message: string, fix: string, compName: string }} error
 */
const showErrorOverlay = (error) => {
  // if already showing error, return
  if (stats.error) return
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
      const closeButton = shadowRoot.querySelector('.parsed-error__close-icon')
      closeButton.addEventListener('click', () => {
        this.remove()
      })
    }
  }

  window.customElements.define('nuejs-error-overlay', errorOverlay)

  const overlay = createElement('nuejs-error-overlay')
  document.body.append(overlay)

  const message = overlay.shadowRoot.querySelector('.message')
  const title = overlay.shadowRoot.querySelector('.title')

  if (error.compName) {
    title.textContent = `error in ${error.compName}`
    const errorMessage = `${error.message}\n\n${error.fix || ''}`
    message.textContent = errorMessage
  } else {
    title.textContent = error.constructor.name
    message.textContent = error.message
  }

  stats.error = true
}

export default showErrorOverlay
