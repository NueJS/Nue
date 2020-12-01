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
      const handler = this.handle[attribute.handler]
      node.addEventListener(attribute.eventName, handler)
      this.on.remove(() => {
        node.removeEventListener(attribute.eventName, handler)
      })
    } else if (attribute.bindProp) { // bind:bindProp={$.key}
      if (node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA') bindInput.call(this, node, attribute.bindProp, attribute.stateChain)
      else {
        // console.log({ bindProp: attribute.bindProp, chain: attribute.stateChain })
        // two way bind
        bindState.call(this, node, attribute.bindProp, true, attribute.stateChain, true)
      }
    } else if (attribute.propName) { // :name={var} or :name=value
      bindState.call(this, node, attribute.propName, attribute.isVar, attribute.stateChain)
    } else {
      bindAttribute.call(this, node, attribute.name, attribute.stateChain)
    }
  })
}

export default processAttributes
