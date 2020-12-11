import { mutate } from '../../reactivity/mutate.js'
import add_state_dep from '../../slice/add_state_dep.js'
import slice from '../../slice/slice.js'
import { add_connects } from '../../node/connections.js'

// bind:value=[path], bind:checked=[path] etc
// set the value from state
// when input's value change set the value in state
function process_bind_attribute (node, info) {
  const isNumber = node.type === 'number' || node.type === 'range'
  const { path, content } = info.placeholder
  const { name } = info
  const value = slice(this.$, path)
  if (value === undefined) return
  node[name] = value

  // when input's value is changed, save the value in state
  // convert the value from string to number if needed
  const handler = e => {
    const value = e.currentTarget[name]
    const converted = isNumber ? Number(value) : value
    mutate(this.$, path, converted, 'set')
  }

  // adding event listener
  node.addEventListener('input', handler)

  const set_value = () => { node[name] = slice(this.$, path) }
  add_connects(node, () => {
    const remove_state_dep = add_state_dep.call(this, path, set_value, 'dom')
    return () => {
      remove_state_dep()
      node.removeEventListener('input', handler)
    }
  })
}

export default process_bind_attribute
