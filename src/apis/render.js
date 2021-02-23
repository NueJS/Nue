import globalInfo from '../utils/globalInfo'
import defineComponent from '../utils/defineComponent'
import showError from '../utils/dev/error-overlay/showError.js'
import DEV from '../utils/dev/DEV'

// define the custom element of given name
const render = (component, settings) => {
  window.globalInfo = globalInfo

  if (DEV) {
    window.onerror = function (message, filename, lineno, colno, error) {
      showError(error)
    }
  }

  if (settings) {
    const { defaultStyle } = settings
    if (defaultStyle) globalInfo.defaultStyle = defaultStyle
  }

  defineComponent(component)
}

export default render
