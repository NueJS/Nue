import { mutate } from '../reactivity/mutate.js'
import onStateChange from '../reactivity/onStateChange.js'
import getSlice from '../value.js'

// bind:value=[path]
// set the value from state
// when input's value change set the value in state
function bindInput (node, bindProp, path) {
  const isNumber = node.type === 'number' || node.type === 'range'
  node[bindProp] = getSlice(this.$, path)

  // when input's value is changed, save the value in state
  // convert the value from string to number if needed
  const handler = e => {
    const value = e.target[bindProp]
    const converted = isNumber ? Number(value) : value
    mutate(this.$, path, converted, 'set')
  }

  // set the value of input from state
  onStateChange.call(this, path, () => {
    node[bindProp] = getSlice(this.$, path)
  })

  // adding event listener
  node.addEventListener('input', handler)

  // cleanup on node or component removal
  const cleanup = () => node.removeEventListener('input', handler)
  this.on.remove(cleanup)
  node.onRemove(cleanup)
}

export default bindInput
