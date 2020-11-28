import getSlice from '../value.js'
import onStateChange from '../reactivity/onStateChange.js'
import addContextDependency from '../context.js'

function bindAttribute (node, atrName, atrKey, context) {
  const chain = atrKey.split('.')

  if (chain[0] === 'state') {
    const stateChain = chain.slice(1)
    node.setAttribute(atrName, getSlice(this.state, stateChain))
    onStateChange.call(this, stateChain, () => {
      node.setAttribute(atrName, getSlice(this.state, stateChain))
    })
  } else {
    node.setAttribute(atrName, getSlice(context, chain))
    addContextDependency(node, {
      type: 'attribute',
      name: atrName,
      key: atrKey
    })
  }
}
export default bindAttribute
