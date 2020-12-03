import getSlice from '../value.js'
import onStateChange from '../reactivity/onStateChange.js'
import { mutate } from '../reactivity/mutate.js'

function addProps (node, key, value, onNodeStateChange) {
  if (!node.props) node.props = {}
  node.props[key] = value
  if (onNodeStateChange) {
    if (!node.twoWayProps) node.twoWayProps = []
    node.twoWayProps.push(onNodeStateChange)
  }
}

function bindState (node, propName, isVar, stateChain, isTwoWayBind) {
  const propNameSplit = propName.split('.')
  // console.log({ propName, isVar, stateChain })
  let onNodeStateChange

  if (isVar) {
    if (isTwoWayBind) {
      onNodeStateChange = () => {
        onStateChange.call(node, propNameSplit, () => {
          const value = getSlice(node.$, propNameSplit)
          // to avoid infinite loop
          // disable state change in child which triggers the change in parent
          node.ignoreStateChange = propNameSplit[0]
          mutate(this.$, stateChain, value, 'set')
          node.ignoreStateChange = undefined
        })
      }
    }
    addProps(node, propName, getSlice(this.$, stateChain), onNodeStateChange)

    // change child nodes' state when parent node's state changes
    onStateChange.call(this, stateChain, () => {
      mutate(node.$, propNameSplit, getSlice(this.$, stateChain), 'set')
    })

    // else {
    //   addProps(node, name, key)
    //   addContextDependency(node, {
    //     type: '$-attribute',
    //     name: name,
    //     key
    //   })
    // }
  } else {
    addProps(node, propName, stateChain)
  }
}

export default bindState
