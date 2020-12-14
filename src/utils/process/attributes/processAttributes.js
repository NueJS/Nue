import bindInput from './bindInput.js'
import addAttribute from './addAttribute.js'
import addState from './addState.js'
import addEvent from './addEvent.js'
import { EVENT, BIND, STATE, FN_PROP } from '../../constants.js'

// ex: @click=[fn]
// set fn.click in the comp
function addFnProp (comp, attribute) {
  const { name, placeholder } = attribute
  if (!comp.fnProps) comp.fnProps = {}
  comp.fnProps[name] = this.fn[placeholder.content]
  // console.log('added fn:', comp.fn, this.fn[placeholder.content])
  comp.removeAttribute(name)
}

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
    // console.log({ attribute })

    // console.log(node.nodeName, attribute.type)
    if (attribute.type === EVENT) addEvent.call(this, node, attribute)
    // bind value on input nodes or bind a prop to custom component
    else if (attribute.type === BIND) {
      if (sweet.isSweet) addState.call(this, node, attribute)
      else bindInput.call(this, node, attribute)
    }

    // prop=[value] on sweet component
    else if (attribute.type === STATE) addState.call(this, node, attribute)
    else if (attribute.type === FN_PROP) addFnProp.call(this, node, attribute)
    else addAttribute.call(this, node, attribute)
  })
}

export default processAttributes
