import { mutate } from '../../reactivity/mutate.js'
import { setupConnection } from '../../node/connections.js'

// ex: :value=[count]
function bindInput (node, attributeMemo) {
  const isNumber = node.type === 'number' || node.type === 'range'
  const { path, getValue, deps } = attributeMemo.placeholder
  const { name } = attributeMemo

  const handler = () => {
    let value = node[name]
    value = isNumber ? Number(value) : value
    mutate(this.$, path, value, 'set')
  }

  node.addEventListener('input', handler)
  const update = () => {
    node[name] = getValue.call(this, node)
  }
  setupConnection.call(this, node, deps, update)
}

export default bindInput
