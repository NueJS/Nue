import slice from '../../state/slice.js'
import addDep from '../../state/addDep.js'
import { mutate } from '../../reactivity/mutate.js'
import { BIND } from '../../constants.js'

// props are a way to send data from parent state to child state
// child component uses props to initialize its state
// props override the default state defined in the component blueprint
function addProps (node, key, value) {
  if (!node.stateProps) node.stateProps = {}
  node.stateProps[key] = value
}

// :name=[path]
function addState (node, attribute) {
  const { name, placeholder } = attribute
  const prop_name_split = name.split('.')

  // if value is not variable, add props
  if (!placeholder) {
    addProps(node, name, placeholder.path)
    return
  }

  // if variable - change the state of node when parent's state changes
  addProps(node, name, placeholder.getValue.call(this, node))
  const flowDown = () => {
    mutate(node.$, prop_name_split, placeholder.getValue.call(this, node), 'set')
  }

  addDep.call(this, placeholder.path, flowDown, 'dom')

  // if attribute is a binding, change the state of parent when node's state changes
  // if (attribute.type === BIND) {
  //   // to avoid infinite loop
  //   // disable slice change in child which triggered the change in parent
  //   const flowUp = () => {
  //     const value = slice(node.$, prop_name_split)
  //     node.ignoredRoot = prop_name_split[0]
  //     mutate(this.$, placeholder.path, value, 'set')
  //     node.ignoredRoot = undefined
  //   }

  //   // when this function is called parent's callbacks are added in deps of node
  //   const on_node_state_change = () => addDep.call(node, prop_name_split, flowUp, 'dom')
  //   if (!node.two_way_props) node.two_way_props = []

  //   // add these functions on node in two_way_props array, call this array when node is added on dom
  //   node.two_way_props.push(on_node_state_change)
  // }
}

export default addState
