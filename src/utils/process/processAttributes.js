import getAttributes from '../getAttributes.js'
import bindInput from '../bind/bindInput.js'
import bindAttribute from '../bind/bindAttribute.js'
import getValue, { getSlice } from '../value.js'
import addContextDependency from '../context.js'
import onStateChange from '../state/onStateChange.js'
import { mutate } from '../reactivity/mutate.js'

function addStateAttribute (node, atrName, atrKey) {
  if (!node.props) node.props = {}
  node.props[atrName] = atrKey
  node.removeAttribute(atrName)
}

function processAttributes (node, context) {
  const attributes = getAttributes(node)

  for (const atrName in attributes) {
    const [atrValue, isVariable] = attributes[atrName]
    const chain = atrValue.split('.')

    if (atrName === 'id') {
      this.refs[atrValue] = node
    }

    // state.name={value} or state.name=value
    if (atrName.startsWith(':')) {
      const name = atrName.substr(1)

      let initValue = atrValue
      if (isVariable) {
        const [value, isStateKey] = getValue.call(this, chain, context)
        initValue = value

        if (isStateKey) {
          const nameChain = name.split('.')
          const chain = atrValue.split('.')
          onStateChange.call(this, chain, () => {
            const value = getSlice.call(this, chain)
            mutate(node.state, nameChain, value, 'set')
          })
        }

        else {
          addContextDependency(node, {
            type: 'state-attribute',
            name: name,
            key: atrValue
          })
        }

        node.removeAttribute(atrName)
      }
      addStateAttribute(node, name, initValue)
      continue
    }

    // if attribute value is not curled
    if (!isVariable) continue

    // @event={handler}
    if (atrName.startsWith('@')) {
      node.removeAttribute(atrName)
      const eventName = atrName.substr(1)
      // console.log({ eventName, handler: this.compObj.handle[atrValue], atrValue })
      node.addEventListener(eventName, this.handle[atrValue])
      continue
    }

    // bind:event={handler}
    if (atrName.startsWith('bind:')) {
      bindInput.call(this, node, atrName, atrValue)
    } else {
      // name={value}
      bindAttribute.call(this, node, atrName, atrValue, context)
    }
  }
}

export default processAttributes
