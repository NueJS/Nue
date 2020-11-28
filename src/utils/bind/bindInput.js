import { mutate } from '../reactivity/mutate.js'
import onStateChange from '../reactivity/onStateChange.js'
import getSlice from '../value.js'

// @event:targetProp={state.key}  example: @input:value={state.key}
// atChain is ['event', 'targetProp']
// chain is ['state', 'key']
function bindInput (node, atChain, chain) {
  const stateChain = chain.slice(1)
  const isNumber = node.type === 'number' || node.type === 'range'
  const eventName = atChain[0]
  const targetProp = atChain[1]
  node[targetProp] = getSlice(this.state, stateChain)

  const handler = e => {
    const value = e.target[targetProp]
    mutate(this.state, stateChain, isNumber ? Number(value) : value, 'set')
  }

  onStateChange.call(this, stateChain, () => {
    node[targetProp] = getSlice(this.state, stateChain)
  })

  node.addEventListener(eventName, handler)
}

export default bindInput
