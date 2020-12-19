import { mutate } from '../../reactivity/mutate.js'
import { wire } from '../../node/connections.js'

// ex: :value=[count]
function bindInput (node, attribute) {
  const isNumber = node.type === 'number' || node.type === 'range'
  const { getValue, deps } = attribute.placeholder
  const { name } = attribute

  const handler = () => {
    let value = node[name]
    value = isNumber ? Number(value) : value
    mutate(this.$, deps[0], value, 'set')
  }

  node.addEventListener('input', handler)

  const cb = () => {
    node[name] = getValue.call(this, node)
  }

  wire.call(this, node, deps, cb)
}

export default bindInput
