import { animate, createElement } from '../../node/dom'
import html from './html'

const handleErrors = (error) => {
  class errorOverlay extends HTMLElement {
    constructor () {
      super()
      const shadowRoot = this.attachShadow({ mode: 'open' })
      shadowRoot.innerHTML = html
    }

    connectedCallback () {
      const closeButton = this.shadowRoot.querySelector('.parsed-error__close-icon')
      closeButton.addEventListener('click', e => {
        const modal = this.shadowRoot.querySelector('.parsed-error__card')

        animate(modal, 'pop-out 400ms ease', true, () => {
          this.remove()
        })
      })
    }
  }

  window.customElements.define('nuejs-error-overlay', errorOverlay)

  const $errorOverlay = createElement('nuejs-error-overlay')
  document.body.append($errorOverlay)

  const $message = $errorOverlay.shadowRoot.querySelector('.message')
  const errorMessage = `${error.message}\n\n${error.fix || ''}`
  $message.textContent = errorMessage

  const $componentName = $errorOverlay.shadowRoot.querySelector('.title')
  $componentName.textContent = `error in <${error.compName}>`
}

export default handleErrors
