import { mutate } from '../reactivity/mutate.js'
import onStateChange from '../state/onStateChange.js'
import { getSlice } from '../value.js'

function bindInput (node, atrName, atrKey) {
  node.removeAttribute(atrName)
  const bindName = atrName.substr(5) // remove bind:
  const eventName = 'input'
  const chain = atrKey.split('.')
  // const attributeValueSplit = chain.slice(1)
  const isNumber = node.type === 'number' || node.type === 'range'
  node[bindName] = getSlice.call(this, chain)

  const handler = e => {
    const value = e.target[bindName]
    mutate(this.state, chain.slice(1), isNumber ? Number(value) : value, 'set')
  }

  onStateChange.call(this, chain, () => {
    node[bindName] = getSlice.call(this, chain)
  })

  node.addEventListener(eventName, handler)
}

export default bindInput
