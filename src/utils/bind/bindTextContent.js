import getValue from '../value.js'
import onStateChange from '../state/onStateChange.js'

function bindTextContent (node, key) {
  const arr = key.split('.').slice(1)
  onStateChange.call(this, arr[0], () => {
    node.textContent = getValue.call(key)
  })
}

export default bindTextContent
