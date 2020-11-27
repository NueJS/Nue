import { mutate } from '../reactivity/mutate.js'
import onStateChange from '../state/onStateChange.js'
import getSlice from '../value.js'

function bindInput (node, attr, key) {
  node.removeAttribute(attr)
  const bindAttr = attr.substr(5) // remove bind:

  const chain = key.split('.')
  const stateChain = chain.slice(1)
  const isNumber = node.type === 'number' || node.type === 'range'
  node[bindAttr] = getSlice(this.state, chain)

  const handler = e => {
    const value = e.target[bindAttr]
    mutate(this.state, stateChain, isNumber ? Number(value) : value, 'set')
  }

  onStateChange.call(this, chain, () => {
    node[bindAttr] = getSlice(this.state, chain)
  })

  const eventName = 'input'
  node.addEventListener(eventName, handler)
}

export default bindInput
