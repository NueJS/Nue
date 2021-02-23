import globalInfo from '../utils/globalInfo'
import defineComponent from '../utils/defineComponent'
import dashify from '../utils/string/dashify'
import showError from '../utils/dev/error-overlay/showError.js'
import DEV from '../utils/dev/DEV'
import { createElement } from '../utils/node/dom'

// define the custom element of given name
const render = (component, settings) => {
  if (DEV) {
    window.onerror = function (message, filename, lineno, colno, error) {
      showError(error)
    }
  }

  if (settings) {
    globalInfo.defaultStyle = settings.defaultStyle
  }

  const name = component.name

  // find the <CompName> in html and replace it with <compname->
  const el = document.querySelector(name)
  const root = createElement(dashify(name))
  el.replaceWith(root)

  defineComponent(component)
}

export default render
