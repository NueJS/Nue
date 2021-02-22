import { createElement } from '../../node/dom'
import html from './html'

function handleErrors (error) {
  class sweetErrorOverlay extends HTMLElement {
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.innerHTML = html
    }

    connectedCallback () {
      const closeButton = this.shadowRoot.querySelector('.parsed-error__close-icon')
      closeButton.addEventListener('click', e => {
        this.remove()
      })
    }
  }

  window.customElements.define('parsed-error-overlay', sweetErrorOverlay)

  const $sweetErrorOverlay = createElement('parsed-error-overlay')
  document.body.append($sweetErrorOverlay)

  const $message = $sweetErrorOverlay.shadowRoot.querySelector('.message')
  const errorMessage = `${error.message}\n\n${error.fix || ''}`
  $message.textContent = errorMessage

  const $componentName = $sweetErrorOverlay.shadowRoot.querySelector('.title')
  $componentName.textContent = `error in <${error.compName}>`
}

export default handleErrors
