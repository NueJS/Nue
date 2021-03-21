import defineCustomElement from '../utils/component/defineCustomElement'
import showError from '../utils/dev/error-overlay/showError.js'
import DEV from '../utils/dev/DEV'
import stats from '../utils/stats'
import { dashify } from '../utils/string/dashify'

/**
 * define the custom element of given name
 * @param {Function} component
 * @param {Element} element
 * @param {{defaultStyle: string}} config
 */
const render = (component, element, config) => {
  if (DEV) {
    window.onerror = (message, filename, lineno, colno, error) => {
      // @ts-ignore
      showError(error)
    }
  }

  // override config with default config
  if (config) stats.config = { ...stats.config, ...config }

  // define the component
  defineCustomElement(component)

  // replace the element with customElement
  const customElement = document.createElement(dashify(component.name))
  element.replaceWith(customElement)
}

export default render
