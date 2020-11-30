// import attrs from '../attrs.js'
import bindInput from '../bind/bindInput.js'
import bindAttribute from '../bind/bindAttribute.js'
import bindState from '../bind/bindState.js'

function processAttributes (node, context) {
  const ref = node.getAttribute('ref')
  if (ref) {
    this.config.refs[ref] = node
  }

  const info = this.getNodeInfo(node)
  if (!(info && info.attributes)) return

  info.attributes.forEach(attribute => {
    if (attribute.eventName) { // @eventName={handler}
      node.addEventListener(attribute.eventName, this.handle[attribute.handler])
    } else if (attribute.bindProp) { // bind:bindProp={state.key}
      bindInput.call(this, node, attribute.bindProp, attribute.stateChain)
    } else if (attribute.propName) { // :name={var} or :name=value
      bindState.call(this, node, attribute.propName, attribute.isVar, attribute.stateChain)
    } else {
      bindAttribute.call(this, node, attribute.name, attribute.stateChain)
    }
  })
}

export default processAttributes
