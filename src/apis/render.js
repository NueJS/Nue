import globalInfo from '../utils/globalInfo'
import DEV from '../utils/dev/DEV'
import errors from '../utils/dev/errors'
import defineComponent from '../utils/defineComponent'
import dashify from '../utils/string/dashify'

// define the custom element of given name
const render = (component, settings) => {
  if (settings) {
    globalInfo.defaultStyle = settings.defaultStyle
  }
  const name = component.name

  // find the <CompName> in html and replace it with <compname-->
  const el = document.querySelector(name)
  const root = document.createElement(dashify(name))
  el.replaceWith(root)

  if (DEV) {
    if (globalInfo.components[name]) {
      errors.COMPONENT_ALREADY_RENDERED(name)
    }
  }

  defineComponent(component)
}

export default render
