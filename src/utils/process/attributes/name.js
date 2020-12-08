import slice from '../../slice/slice.js'
// import add_slice_dependency from '../../slice/add_slice_dependency.js'
import { FN, REACTIVE } from '../../constants.js'
import { add_connects } from '../../node/connections.js'

// get the value of slice having the given path and set the attribute value
// when the slice changes, update the value of attribute as well
function process_attribute (node, info) {
  const { placeholder, name } = info
  let get_value, dependency

  if (placeholder.type === FN) {
    get_value = () => placeholder.get_value()
    dependency = placeholder.deps
  } else if (placeholder.type === REACTIVE) {
    get_value = () => slice(this.$, placeholder.path)
    dependency = [placeholder.content]
  }

  const set_value = () => node.setAttribute(name, get_value())
  add_connects(node, () => this.on.domUpdate(set_value, dependency))
}

export default process_attribute
