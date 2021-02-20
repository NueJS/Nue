import globalInfo from './globalInfo'
import { createElement } from './node/dom'

const addDefaultStyles = (template) => {
  const { content } = template
  const style = content.querySelector('style')
  const defaultStyle = createElement('style')
  defaultStyle.setAttribute('default-styles', '')
  defaultStyle.textContent = globalInfo.defaultStyle
  if (style) {
    style.before(defaultStyle)
  } else {
    content.lastChild.after(defaultStyle)
  }
}

export default addDefaultStyles
