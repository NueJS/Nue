import bindInput from './bindInput.js'
import addAttribute from './addAttribute.js'
import addState from './addState.js'
import addEvent from './addEvent.js'
import { EVENT, BIND, STATE } from '../../constants.js'

function processAttributes (comp, node) {
  // refs API
  if (node.hasAttribute('ref')) {
    comp.refs[node.getAttribute('ref')] = node
    node.removeAttribute('ref')
  }

  const { parsed } = node

  // if no attributes memo available for node
  if (!parsed.attributes) return

  parsed.attributes.forEach(attribute => {
    const { type } = attribute
    if (type === EVENT) addEvent(comp, node, attribute)

    // bind placeholder
    else if (type === BIND) bindInput(comp, node, attribute)

    // placeholder attribute on component
    else if (type === STATE) addState(comp, node, attribute)

    // placeholder attribute on non-component
    else addAttribute(comp, node, attribute)
  })
}

export default processAttributes
