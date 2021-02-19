// import { mutate } from '../../reactivity/mutate'
// import { addDeps } from '../../state/addDep'

// // name=[path]
// function addState (comp, node, attribute) {
//   const { name, placeholder } = attribute
//   const { getValue, deps } = placeholder
//   // pass the stateProps to child component to initialize state
//   if (!node.parsed.stateProps) node.parsed.stateProps = {}
//   node.parsed.stateProps[name] = getValue(comp.$)

//   // when the parent state changes, update the state of child component
//   const cb = () => {
//     mutate(node.nue.$, [name], getValue(comp.$))
//   }

//   addDeps(comp, deps, cb, 'computed')
// }

// export default addState
