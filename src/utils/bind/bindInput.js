import { mutate } from '../reactivity/mutate.js'
import onStateChange from '../reactivity/onStateChange.js'
import getSlice from '../value.js'

// @eventName:prop={stateChain}
function bindInput (node, bindProp, stateChain) {
  console.log({ node, bindProp, stateChain })
  const isNumber = node.type === 'number' || node.type === 'range'
  node[bindProp] = getSlice(this.state, stateChain)

  const handler = e => {
    const value = e.target[bindProp]
    mutate(this.state, stateChain, isNumber ? Number(value) : value, 'set')
  }

  onStateChange.call(this, stateChain, () => {
    node[bindProp] = getSlice(this.state, stateChain)
  })

  node.addEventListener('input', handler)
}

export default bindInput
