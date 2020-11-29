// import attrs from '../attrs.js'
import bindInput from '../bind/bindInput.js'
import bindAttribute from '../bind/bindAttribute.js'
import bindState from '../bind/bindState.js'

function processAttributes (node, context) {
  const info = this.getNodeInfo(node)
  if (!(info && info.attributes)) return

  info.attributes.forEach(attribute => {
    if (attribute.eventName) { // @xyz={abc}
      if (attribute.handler) { // @click={handler}
        node.addEventListener(attribute.eventName, this.handle[attribute.handler])
      } else if (attribute.targetProp) { // @input:value={state.key}
        bindInput.call(this, node, attribute.eventName, attribute.targetProp, attribute.stateChain)
      }
    } else if (attribute.propName) { // :name={var} or :name=value
      bindState.call(this, node, attribute.propName, attribute.isVar, attribute.stateChain)
    } else {
      bindAttribute.call(this, node, attribute.name, attribute.stateChain)
    }
  })
}

export default processAttributes
