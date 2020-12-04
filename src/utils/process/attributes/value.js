import slice from '../../slice/slice.js'
import add_slice_dependency from '../../slice/add_slice_dependency.js'

// get the value of slice having the given path and set the attribute value
// when the slice changes, update the value of attribute as well
function process_attribute (node, name, path) {
  const set = () => {
    const value = slice(this.$, path)
    node.setAttribute(name, value)
  }

  set()
  add_slice_dependency.call(this, path, set)
}

export default process_attribute
