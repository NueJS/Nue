import { uncurl } from '../str.js'
import getValue from '../value.js'

function hideIf (node, hide) {
  if (hide) node.removeAttribute('hidden')
  else node.setAttribute('hidden')
}

function processIf (templateNode, context) {
  let ifKey = templateNode.getAttribute('if')
  if (ifKey) {
    ifKey = uncurl(ifKey)
    const [ifValue, isStateKey] = getValue.call(this, ifKey, context)
    const frag = templateNode.content.cloneNode(true);
    [...frag.childNodes].forEach(node => {
      templateNode.before(node)
      hideIf(node, ifValue)
      if (isStateKey) this.onStateChange(ifKey, () => hideIf(node, this.state[ifKey]))
    })
  }
}

export default processIf
