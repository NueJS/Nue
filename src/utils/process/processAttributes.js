// import attrs from '../attrs.js'
import bindInput from '../bind/bindInput.js'
import bindAttribute from '../bind/bindAttribute.js'
import bindState from '../bind/bindState.js'

function processAttributes (node, context) {
  const info = this.getNodeInfo(node)
  if (!(info && info.attributes)) return

  info.attributes.forEach(attribute => {
    console.log(attribute)
    const { eventName, targetProp, stateChain, handler, name, propName, isVar } = attribute

    if (eventName) { // @xyz={abc}
      if (handler) { // @click={handler}
        node.addEventListener(eventName, this.handle[handler])
      } else if (targetProp) { // @input:value={state.key}
        bindInput.call(this, node, eventName, targetProp, stateChain)
      }
    } else if (propName) { // :name={var} or :name=value
      bindState.call(this, node, propName, isVar, stateChain)
    } else {
      bindAttribute.call(this, node, name, stateChain)
    }
  })
}

export default processAttributes
