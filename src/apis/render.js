import defineCustomElement from '../utils/component/defineCustomElement'
import showError from '../utils/dev/error-overlay/showError.js'
import DEV from '../utils/dev/DEV'
import stats from '../utils/stats'
import { dashify } from '../utils/string/dashify'

// define the custom element of given name
const render = (component, el, config) => {
  if (DEV) {
    window.onerror = (message, filename, lineno, colno, error) => {
      showError(error)
    }
  }
  // override config with default config
  if (config) stats.config = { ...stats.config, ...config }
  defineCustomElement(component)
  const compEl = document.createElement(dashify(component.name))
  el.replaceWith(compEl)
}

export default render
