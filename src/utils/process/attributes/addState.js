// import slice from '../../state/slice.js'
// import addDep from '../../state/addDep.js'
// import { mutate } from '../../reactivity/mutate.js'
// import { wire } from '../../node/connections.js'
// import { BIND } from '../../constants.js'

// props are a way to send data from parent state to child state
// child component uses props to initialize its state
// props override the default state defined in the component blueprint

// :name=[path]
function addState (node, attribute) {
  const { name, placeholder } = attribute
  const { getValue } = placeholder

  // pass the stateProps to child component to initialize state
  if (!node.stateProps) node.stateProps = {}
  // debugger
  node.stateProps[name] = getValue.call(this)

  // update the state of node, when parent state changes
  // const update = () => {
  //   mutate(node.$, [name], getValue.call(this, node), 'set')
  // }

  // wire.call(this, node, [path], update)
}

export default addState
