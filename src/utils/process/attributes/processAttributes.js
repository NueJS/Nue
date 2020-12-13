// import get_attributes from '../get_attributes.js'
import bindInput from './bindInput.js'
import addAttribute from './addAttribute.js'
import addState from './addState.js'
import addEvent from './addEvent.js'
import { EVENT, BIND, STATE } from '../../constants.js'

function processAttributes (node) {
  // refs API
  if (node.hasAttribute('ref')) this.refs[node.getAttribute('ref')] = node

  // if no attributes memo available for node
  if (!node.sweet.attributes) return

  node.sweet.attributes.forEach(attribute => {
    if (attribute.type === EVENT) {
      addEvent.call(this, node, attribute)
    }
    // bind value on input nodes or bind a prop to custom component
    else if (attribute.type === BIND) {
      // bind:value=[slice]
      if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
        bindInput.call(this, node, attribute)
      }

      // bind:bindProp={key} on custom component
      // @TODO : check if the node is custom component
      else addState.call(this, node, attribute)
    }

    // :name={var} or :name=value set the state of component
    else if (attribute.type === STATE) {
      addState.call(this, node, attribute)
    }

    // set value of simple attributes to state
    else {
      addAttribute.call(this, node, attribute)
    }
  })
}

export default processAttributes
