import { mutate } from '../reactivity/mutate.js'
import onStateChange from '../reactivity/onStateChange.js'
import getSlice from '../value.js'

// @eventName:prop={stateChain}
function bindInput (node, bindProp, stateChain) {
  const isNumber = node.type === 'number' || node.type === 'range'
  node[bindProp] = getSlice(this.$, stateChain)

  const handler = e => {
    const value = e.target[bindProp]
    mutate(this.$, stateChain, isNumber ? Number(value) : value, 'set')
  }

  onStateChange.call(this, stateChain, () => {
    node[bindProp] = getSlice(this.$, stateChain)
  })

  // console.log({ handler })

  node.addEventListener('input', handler)
  this.on.remove(() => {
    node.removeEventListener('input', handler)
  })
}

export default bindInput
