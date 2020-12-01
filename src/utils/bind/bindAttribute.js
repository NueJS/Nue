import getSlice from '../value.js'
import onStateChange from '../reactivity/onStateChange.js'
// import addContextDependency from '../context.js'

function bindAttribute (node, name, stateChain) {
  node.setAttribute(name, getSlice(this.$, stateChain))
  onStateChange.call(this, stateChain, () => {
    node.setAttribute(name, getSlice(this.$, stateChain))
  })

  // if (chain[0] === '$') {

  // }

  // else {
  //   node.setAttribute(atrName, getSlice(context, chain))
  //   addContextDependency(node, {
  //     type: 'attribute',
  //     name: atrName,
  //     key: atrKey
  //   })
  // }
}
export default bindAttribute
