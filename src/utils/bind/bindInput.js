import { mutate } from '../reactivity/mutate.js'

function bindInput (node, atrName, atrKey) {
  const bindName = atrName.substr(5) // remove bind:
  const eventName = 'input'
  const attributeValueSplit = atrKey.split('.').slice(1)
  const isNumber = node.type === 'number' || node.type === 'range'
  let handler

  if (isNumber) {
    handler = e => {
      const value = e.target[bindName]
      mutate(this.state, attributeValueSplit, Number(value), 'set')
    }
  } else {
    handler = e => {
      const value = e.target[bindName]
      mutate(this.state, attributeValueSplit, value, 'set')
    }
  }

  node.addEventListener(eventName, handler)
}

export default bindInput
