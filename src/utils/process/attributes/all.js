// import get_attributes from '../get_attributes.js'
import bind_input from './attributes/bind_input.js.js.js'
import bind_attr from './attributes/bind_attr.js.js.js'
import add_state from './attributes/add_state.js.js.js'

function processAttributes (node, memo) {
  // console.log(node.nodeName, node.getAttribute)
  const ref = node.getAttribute('ref')
  if (ref) {
    this.memo.refs[ref] = node
  }

  const info = memo
  if (!(info && info.attributes)) return

  console.log(node, info.attributes)
  info.attributes.forEach(attribute => {
    // @eventName={handler}
    if (attribute.eventName) {
      processEventAttributes.call(this, node, attribute)
    }
    // bind value on input nodes or bind a prop to custom component
    else if (attribute.bindProp) {
      if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA') {
        bind_input.call(this, node, attribute.bindProp, attribute.path)
      }

      // bind:bindProp={key} on custom component
      else {
        add_state.call(this, node, attribute.bindProp, true, attribute.path, true)
      }
    }

    // :name={var} or :name=value set the state of component
    else if (attribute.propName) {
      add_state.call(this, node, attribute.propName, attribute.isVar, attribute.path)
    }

    // set value of simple attributes to state
    else {
      bind_attr.call(this, node, attribute.name, attribute.path)
    }
  })
}

export default processAttributes
