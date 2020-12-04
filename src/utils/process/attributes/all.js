// import get_attributes from '../get_attributes.js'
import process_bind_attribute from './bind.js'
import process_attribute from './value.js'
import process_state_attribute from './state.js'
import process_event_attributes from './event.js'

function processAttributes (node, memo) {
  // @TODO move this to memo
  // process ref attribute
  const ref = node.getAttribute('ref')
  if (ref) this.memo.refs[ref] = node

  // if not memo
  if (!(memo && memo.attributes)) return

  memo.attributes.forEach(attribute => {
    // @eventName={handler}
    if (attribute.eventName) {
      process_event_attributes.call(this, node, attribute)
    }
    // bind value on input nodes or bind a prop to custom component
    else if (attribute.bindProp) {
      const { bindProp, path } = attribute
      // bind:value=[slice]
      if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA') {
        process_bind_attribute.call(this, node, bindProp, path)
      }

      // bind:bindProp={key} on custom component
      else {
        process_state_attribute.call(this, node, bindProp, true, path, true)
      }
    }

    // :name={var} or :name=value set the state of component
    else if (attribute.propName) {
      const { propName, isVar, path } = attribute
      process_state_attribute.call(this, node, propName, isVar, path)
    }

    // set value of simple attributes to state
    else {
      const { name, path } = attribute
      process_attribute.call(this, node, name, path)
    }
  })
}

export default processAttributes
