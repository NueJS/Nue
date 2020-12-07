import slice from '../../slice/slice.js'
import add_slice_dependency from '../../slice/add_slice_dependency.js'
import { FN } from '../../constants.js'

// get the value of slice having the given path and set the attribute value
// when the slice changes, update the value of attribute as well
function process_attribute (node, info) {
  const { placeholder, name } = info
  console.log({ name, nodeName: node.nodeName })
  if (info.placeholder.type === FN) {
    const { on_args_change, deps } = info.placeholder
    const update_attribute = on_args_change((value) => {
      node.setAttribute(name, value)
    })
    update_attribute()
    this.on.domUpdate(update_attribute, deps)
  }

  else {
    const update_attribute = () => {
      const value = slice(this.$, placeholder.path)
      node.setAttribute(name, value)
    }

    update_attribute()
    add_slice_dependency.call(this, placeholder.path, update_attribute)
  }
}

export default process_attribute
