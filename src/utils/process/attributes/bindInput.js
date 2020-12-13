import { mutate } from '../../reactivity/mutate.js'
import addDep from '../../slice/addDep.js'
import { addConnects } from '../../node/connections.js'

// :prop=[...]
// initialize the value of prop from state
// when the input changes, set the prop's value in state

function bindInput (node, attributeMemo) {
  // if input type is number convert the value to number
  const isNumber = node.type === 'number' || node.type === 'range'

  const { path, get_value } = attributeMemo.placeholder
  const { name } = attributeMemo

  const handler = () => {
    let value = node[name]
    value = isNumber ? Number(value) : value
    mutate(this.$, path, value, 'set')
  }

  node.addEventListener('input', handler)

  const set_value = () => {
    node[name] = get_value()
  }

  set_value()
  // should I remove event listener when this node is removed ?
  addConnects(node, () => addDep.call(this, path, set_value, 'dom'))
}

export default bindInput
