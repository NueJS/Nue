import { mutate } from '../reactivity/mutate.js'
import onStateChange from '../state/onStateChange.js'
import { getSlice } from '../value.js'

function bindInput (node, atrName, atrKey) {
  node.removeAttribute(atrName)
  const bindName = atrName.substr(5) // remove bind:
  const eventName = 'input'
  const attributeValueSplit = atrKey.split('.').slice(1)
  const isNumber = node.type === 'number' || node.type === 'range'
  node[bindName] = getSlice.call(this, atrKey)

  const handler = e => {
    const value = e.target[bindName]
    mutate(this.state, attributeValueSplit, isNumber ? Number(value) : value, 'set')
  }

  onStateChange.call(this, atrKey, () => {
    node[bindName] = getSlice.call(this, atrKey)
  })

  node.addEventListener(eventName, handler)
}

export default bindInput
