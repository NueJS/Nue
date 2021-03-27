import { defineCustomElement } from '../utils/component/defineCustomElement'
import { showErrorOverlay } from '../utils/dev/error-overlay/showErrorOverlay.js'
import { data } from '../utils/data'
import { dashify } from '../utils/string/dashify'

/**
 * define the custom targetElement of given name
 * @param {Function} component
 * @param {HTMLElement} targetElement
 * @param {Config} [config]
 */

export const render = (component, targetElement, config) => {

  // attach error-overlay
  if (_DEV_) {
    // @ts-expect-error
    window.data = data
    window.onerror = (message, filename, lineno, colno, error) => {
      // @ts-ignore
      showErrorOverlay(error)
    }
  }

  // override config with default config
  if (config) data._config = { ...data._config, ...config }

  defineCustomElement(component)

  // replace the targetElement with customElement
  const customElement = document.createElement(dashify(component.name))
  targetElement.replaceWith(customElement)
}
