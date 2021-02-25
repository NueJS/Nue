import defineCustomElement from '../utils/component/defineCustomElement'
import showError from '../utils/dev/error-overlay/showError.js'
import DEV from '../utils/dev/DEV'
import stats from '../utils/stats'

// define the custom element of given name
const render = (component, config) => {
  if (DEV) {
    window.onerror = (message, filename, lineno, colno, error) => {
      showError(error)
    }
  }
  // override config with default config
  if (config) stats.config = { ...stats.config, ...config }
  defineCustomElement(component)
}

export default render
