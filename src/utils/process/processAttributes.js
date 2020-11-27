import getAttributes from '../getAttributes.js'
import bindInput from '../bind/bindInput.js'
import bindAttribute from '../bind/bindAttribute.js'
import getValue from '../value.js'
import addContextDependency from '../context.js'

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
      if (isVariable) {
        const [value, isStateKey] = getValue.call(this, chain, context)
        addStateAttribute(node, name, value)
        if (!isStateKey) {
          addContextDependency(node, {
            type: 'state-attribute',
            name: name,
            key: atrValue
          })
        }
      }
      else addStateAttribute(node, atrName, atrValue)
      continue
    }

    // if attribute value is not curled
    if (!isVariable) continue

    // @event={handler}
    if (atrName.startsWith('@')) {
      node.removeAttribute(atrName)
      const eventName = atrName.substr(1)
      node.addEventListener(eventName, this.compObj[atrValue].bind(this))
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
