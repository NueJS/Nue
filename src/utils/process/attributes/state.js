import slice from '../../slice/slice.js'
import add_slice_dependency from '../../slice/add_slice_dependency.js'
import { mutate } from '../../reactivity/mutate.js'
import { BIND } from '../../constants.js'
// import modes from '../../reactivity/modes.js'

// props are a way to send data from parent state to child state
// child component uses props to initialize its state
// props override the default state defined in the component blueprint
function add_props (node, key, value) {
  if (!node.props) node.props = {}
  node.props[key] = value
}

// :name=[path]
function process_state_attribute (node, info) {
  const { name, is_placeholder, path } = info
  const prop_name_split = name.split('.')

  // if value is not variable, add props
  if (!is_placeholder) {
    add_props(node, name, path)
    return
  }

  // if variable - change the state of node when parent's state changes
  add_props(node, name, slice(this.$, path))
  const flow_down = () => {
    mutate(node.$, prop_name_split, slice(this.$, path), 'set')
  }
  add_slice_dependency.call(this, path, flow_down)

  // if attribute is a binding, change the state of parent when node's state changes
  if (info.type === BIND) {
    // to avoid infinite loop
    // disable slice change in child which triggered the change in parent
    const flow_up = () => {
      const value = slice(node.$, prop_name_split)
      node.ignore_chain = prop_name_split[0]
      mutate(this.$, path, value, 'set')
      node.ignore_chain = undefined
    }

    // when this function is called parent's callbacks are added in slice_deps of node
    const on_node_state_change = () => add_slice_dependency.call(node, prop_name_split, flow_up)
    if (!node.two_way_props) node.two_way_props = []

    // add these functions on node in two_way_props array, call this array when node is added on dom
    node.two_way_props.push(on_node_state_change)
  }
}

export default process_state_attribute
