// import get_attributes from '../get_attributes.js'
import process_bind_attribute from './bind.js'
import process_attribute from './name.js'
import process_state_attribute from './state.js'
import process_event_attributes from './event.js'
import { EVENT, BIND, STATE } from '../../constants.js'

function process_attributes (node, context) {
  // @TODO move this to memo
  // process ref attribute
  const node_memo = this.memo_of(node)

  // refs API
  if (node.hasAttribute('ref')) {
    const key = node.getAttribute('ref')
    this.refs[key] = node
  }

  // if not memo
  if (!(node_memo && node_memo.attributes)) return

  node_memo.attributes.forEach(info => {
    if (info.type === EVENT) {
      process_event_attributes.call(this, node, info)
    }
    // bind value on input nodes or bind a prop to custom component
    else if (info.type === BIND) {
      // bind:value=[slice]
      if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
        process_bind_attribute.call(this, node, info)
      }

      // bind:bindProp={key} on custom component
      else {
        process_state_attribute.call(this, node, info)
      }
    }

    // :name={var} or :name=value set the state of component
    else if (info.type === STATE) {
      process_state_attribute.call(this, node, info)
    }

    // set value of simple attributes to state
    else {
      process_attribute.call(this, node, info)
    }
  })
}

export default process_attributes
