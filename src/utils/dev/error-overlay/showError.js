import html from './html'

function handleErrors (error) {
  // -----------------------
  const errorMessage = `

  ❌ ${error.message}

  ✨ ${error.fix}
  `
  // -----------------------

  class sweetErrorOverlay extends HTMLElement {
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.innerHTML = html
    }

    connectedCallback () {
      const closeButton = this.shadowRoot.querySelector('.sweet-error__close-icon')
      closeButton.addEventListener('click', e => {
        this.remove()
      })
    }
  }

  window.customElements.define('sweet-error-overlay', sweetErrorOverlay)

  const $sweetErrorOverlay = document.createElement('sweet-error-overlay')
  document.body.append($sweetErrorOverlay)

  const $message = $sweetErrorOverlay.shadowRoot.querySelector('.message')
  $message.textContent = `❌ ${error.message}\n✨ ${error.fix}`

  const $componentName = $sweetErrorOverlay.shadowRoot.querySelector('.title')
  $componentName.textContent = `error in <${error.comp.self.supersweet.name}/> `

  // error in console
  console.log('Origin of Error: ')
  if (error.node) console.log('Node:', error.node)
  if (error.comp) console.log('Component: ', error.comp.self)
  throw new Error(errorMessage)
}

export default handleErrors
