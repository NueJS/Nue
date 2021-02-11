import bindInput from './bindInput.js'
import addAttribute from './addAttribute.js'
import addState from './addState.js'
import addEvent from './addEvent.js'
import { EVENT, BIND, STATE, FN_PROP } from '../../constants.js'

// ex: @click=[fn]
// set fn.click in the comp
// function addFnProp (parentComp, comp, attribute) {
//   const { name, placeholder } = attribute
//   if (!comp.fnProps) comp.fnProps = {}
//   comp.fnProps[name] = parentComp.fn[placeholder.content]
//   comp.removeAttribute(name)
// }

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
    // bind value on input nodes or bind a prop to custom component
    else if (type === BIND) {
      if (parsed.isComp) addState(comp, node, attribute)
      else bindInput(comp, node, attribute)
    }

    // prop=[value] on parsed component
    else if (type === STATE) addState(comp, node, attribute)
    // else if (type === FN_PROP) addFnProp(comp, node, attribute)
    else addAttribute(comp, node, attribute)
  })
}

export default processAttributes
