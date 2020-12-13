import { addConnects } from '../../node/connections.js'
import addDep from '../../slice/addDep.js'

// get the value of slice having the given path and set the attribute value
// when the slice changes, update the value of attribute as well
function process_attribute (node, info) {
  const { placeholder, name } = info
  const set_value = () => node.setAttribute(name, placeholder.get_value())
  const connect = () => placeholder.deps.map(path => addDep.call(this, path, set_value, 'dom'))
  addConnects(node, connect)
}

export default process_attribute
