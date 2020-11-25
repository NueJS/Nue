import { getSlice } from '../value.js'
import onStateChange from '../state/onStateChange.js'

function bindTextContent (node, key) {
  const arr = key.split('.').slice(1)
  onStateChange.call(this, arr[0], () => {
    node.textContent = getSlice.call(this, key)
  })
}

export default bindTextContent
