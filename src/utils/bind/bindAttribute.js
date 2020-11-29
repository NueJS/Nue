import getSlice from '../value.js'
import onStateChange from '../reactivity/onStateChange.js'
// import addContextDependency from '../context.js'

function bindAttribute (node, name, stateChain) {
  node.setAttribute(name, getSlice(this.state, stateChain))
  onStateChange.call(this, stateChain, () => {
    node.setAttribute(name, getSlice(this.state, stateChain))
  })

  // if (chain[0] === 'state') {

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
