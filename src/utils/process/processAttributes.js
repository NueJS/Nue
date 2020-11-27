import attrs from '../attrs.js'
import bindInput from '../bind/bindInput.js'
import bindAttribute from '../bind/bindAttribute.js'
import getSlice from '../value.js'
import addContextDependency from '../context.js'
import onStateChange from '../state/onStateChange.js'
import { mutate } from '../reactivity/mutate.js'

function addProps (node, key, value) {
  if (!node.props) node.props = {}
  node.props[key] = value
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

      continue
    }

    if (!isVariable) continue

    // @event={handler}
    if (attr.startsWith('@')) {
      node.removeAttribute(attr)
      const eventName = attr.substr(1) // remove @
      node.addEventListener(eventName, this.handle[key])
      continue
    }

    // bind:event={handler}
    if (attr.startsWith('bind:')) {
      bindInput.call(this, node, attr, key)
    } else {
      // name={value}
      bindAttribute.call(this, node, attr, key, context)
    }
  }
}

export default processAttributes
