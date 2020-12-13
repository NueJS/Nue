// import get_attributes from '../get_attributes.js'
import process_bind_attribute from './bind.js'
import process_attribute from './name.js'
import process_state_attribute from './state.js'
import process_event_attributes from './event.js'
import { EVENT, BIND, STATE } from '../../constants.js'

function process_attributes (node) {
  // refs API
  if (node.hasAttribute('ref')) this.refs[node.getAttribute('ref')] = node

  // console.log('attributes: ', node.supersweet)
  // if no attributes memo available for node
  if (!node.supersweet.attributes) return

  node.supersweet.attributes.forEach(attributeMemo => {
    console.log('at memo: ', attributeMemo)
    if (attributeMemo.type === EVENT) {
      process_event_attributes.call(this, node, attributeMemo)
    }
    // bind value on input nodes or bind a prop to custom component
    else if (attributeMemo.type === BIND) {
      // bind:value=[slice]
      if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
        process_bind_attribute.call(this, node, attributeMemo)
      }

      // bind:bindProp={key} on custom component
      // @TODO : check if the node is custom component
      else process_state_attribute.call(this, node, attributeMemo)
    }

    // :name={var} or :name=value set the state of component
    else if (attributeMemo.type === STATE) {
      process_state_attribute.call(this, node, attributeMemo)
    }

    // set value of simple attributes to state
    else {
      process_attribute.call(this, node, attributeMemo)
    }
  })
}

export default process_attributes
