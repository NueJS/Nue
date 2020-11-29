import getSlice from '../value.js'
import onStateChange from '../reactivity/onStateChange.js'
import { mutate } from '../reactivity/mutate.js'

function addProps (node, key, value) {
  if (!node.props) node.props = {}
  node.props[key] = value
}

function bindState (node, propName, isVar, stateChain) {
  const propNameSplit = propName.split('.')
  if (isVar) {
    addProps(node, name, getSlice(this.state, stateChain))

    // change node's state when its props change
    onStateChange.call(this, stateChain, () => {
      mutate(node.state, propNameSplit, getSlice(this.state, stateChain), 'set')
    })

    // else {
    //   addProps(node, name, key)
    //   addContextDependency(node, {
    //     type: 'state-attribute',
    //     name: name,
    //     key
    //   })
    // }
  }
}

export default bindState
