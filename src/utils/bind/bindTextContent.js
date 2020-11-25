import { getSlice } from '../value.js'
import onStateChange from '../state/onStateChange.js'

function bindTextContent (node, key) {
  onStateChange.call(this, key, () => {
    node.textContent = getSlice.call(this, key)
  })
}

export default bindTextContent
