import wire from '../connection/wire.js'

function processTextNode (nue, node) {
  const { getValue, deps } = node.parsed.placeholder
  const update = () => {
    node.textContent = getValue(nue)
  }
  wire(nue, node, deps, update)
}

export default processTextNode
