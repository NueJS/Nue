import { mutate } from '../reactivity/mutate.js'
import onStateChange from '../reactivity/onStateChange.js'
import getSlice from '../value.js'

// @eventName:prop={stateChain}
function bindInput (node, eventName, prop, stateChain) {
  const isNumber = node.type === 'number' || node.type === 'range'
  node[prop] = getSlice(this.state, stateChain)

  const handler = e => {
    const value = e.target[prop]
    mutate(this.state, stateChain, isNumber ? Number(value) : value, 'set')
  }

  onStateChange.call(this, stateChain, () => {
    node[prop] = getSlice(this.state, stateChain)
  })

  node.addEventListener(eventName, handler)
}

export default bindInput
