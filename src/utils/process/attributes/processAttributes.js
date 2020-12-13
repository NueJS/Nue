// import get_attributes from '../get_attributes.js'
import bindInput from './bindInput.js'
import addAttribute from './addAttribute.js'
import addState from './addState.js'
import addEvent from './addEvent.js'
import { EVENT, BIND, STATE } from '../../constants.js'

function processAttributes (node) {
  // refs API
  if (node.hasAttribute('ref')) {
    this.refs[node.getAttribute('ref')] = node
    node.removeAttribute('ref')
  }

  const { sweet } = node

  // if no attributes memo available for node
  if (!sweet.attributes) return

  sweet.attributes.forEach(attribute => {
    if (attribute.type === EVENT) addEvent.call(this, node, attribute)
    // bind value on input nodes or bind a prop to custom component
    else if (attribute.type === BIND) {
      if (sweet.isSweet) addState.call(this, node, attribute)
      else bindInput.call(this, node, attribute)
    }

    // prop=[value] on sweet component
    else if (attribute.type === STATE) addState.call(this, node, attribute)
    else addAttribute.call(this, node, attribute)
  })
}

export default processAttributes
