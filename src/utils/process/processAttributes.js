import attrs from '../attrs.js'
import bindInput from '../bind/bindInput.js'
import bindAttribute from '../bind/bindAttribute.js'
import getSlice from '../value.js'
import addContextDependency from '../context.js'
import onStateChange from '../reactivity/onStateChange.js'
import { mutate } from '../reactivity/mutate.js'

function addProps (node, key, value) {
  if (!node.props) node.props = {}
  node.props[key] = value
}

// attribute -> :name={var} or :name=value
// atr = ':name'
// key = var or value
// chain is ['var'] or ['value']
// isVariable true or false
function bindStateToNode (node, propName, isVar, stateChain) {
  const propNameSplit = propName.split('.')
  if (isVar) {
    addProps(node, name, getSlice(this.state, stateChain))

    // change node's state when its props change
    onStateChange.call(this, stateChain, () => {
      mutate(node.state, propNameSplit, getSlice(this.state, stateChain), 'set')
    })

    // if (chain[0] === 'state') {

    // }

    // else {
    //   addProps(node, name, key)
    //   addContextDependency(node, {
    //     type: 'state-attribute',
    //     name: name,
    //     key
    //   })
    // }
  }
}

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
      bindStateToNode.call(this, node, propName, isVar, stateChain)
    } else {
      bindAttribute.call(this, node, name, stateChain)
    }
  })
}

export default processAttributes
