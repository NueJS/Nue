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
function bindStateToNode (node, attr, chain, key, isVariable) {
  node.removeAttribute(attr)
  const name = attr.substr(1)

  if (isVariable) {
    if (chain[0] === 'state') {
      const nameChain = name.split('.')
      const stateChain = chain.slice(1)
      addProps(node, name, getSlice(this.state, stateChain))

      // change node's state when its props change
      onStateChange.call(this, stateChain, () => {
        mutate(node.state, nameChain, getSlice(this.state, stateChain), 'set')
      })
    }

    else {
      addProps(node, name, key)
      addContextDependency(node, {
        type: 'state-attribute',
        name: name,
        key
      })
    }
  }
}

function processAttributes (node, context) {
  const attributes = attrs(node)

  for (const attr in attributes) {
    const [key, isVariable] = attributes[attr]
    const chain = key.split('.')

    // refs API
    if (attr === 'id') {
      this.refs[key] = node
    }

    // :name={var} or :name=value
    if (attr.startsWith(':')) {
      bindStateToNode.call(this, node, attr, chain, key, isVariable)
      continue
    }

    if (!isVariable) continue

    node.removeAttribute(attr)

    // @event={handler} or @event:targetProp={state.key}
    if (attr.startsWith('@')) {
      const atRemoved = attr.substr(1) // event or event:targetProp
      const atChain = atRemoved.split(':') // ['event'] or ['event', 'targetProp']
      // chain is ['handler'] or ['state', 'key']

      // @event={handler}
      if (atChain.length === 1) {
        const eventName = atRemoved // remove @
        node.addEventListener(eventName, this.handle[key])
        continue
      }
      // @event:targetProp={state.key}
      else {
        bindInput.call(this, node, atChain, chain)
      }
    }

    // name={value}
    else {
      bindAttribute.call(this, node, attr, key, context)
    }
  }
}

export default processAttributes
