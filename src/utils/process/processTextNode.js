import wire from '../connection/wire.js'

function processTextNode (comp, node) {
  const { getValue, deps } = node.sweet.placeholder
  const update = () => {
    node.textContent = getValue(comp, node)
  }
  wire(comp, node, deps, update)
}

export default processTextNode
