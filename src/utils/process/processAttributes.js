import getAttributes from '../getAttributes.js'
import bindInput from '../bind/bindInput.js'
import bindAttribute from '../bind/bindAttribute.js'
import getValue from '../value.js'
import addContextDependency from '../context.js'

function addStateAttribute (node, atrName, atrKey) {
  if (!node.props) node.props = {}
  node.props[atrName.substr(6)] = atrKey
  node.removeAttribute(atrName)
}

function processAttributes (node, context) {
  const attributes = getAttributes(node)

  for (const atrName in attributes) {
    const [atrValue, isVariable] = attributes[atrName]

    if (atrName === 'id') {
      this.refs[atrValue] = node
    }

    // state.name={value} or state.name=value
    if (atrName.startsWith('state.')) {
      if (isVariable) {
        const [value, isStateKey] = getValue.call(this, atrValue, context)
        addStateAttribute(node, atrName, value)
        if (!isStateKey) {
          addContextDependency(node, {
            type: 'state-attribute',
            name: atrName.substr(6),
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
