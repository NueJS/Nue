import wire from '../connection/wire.js'

function processTextNode (comp, node) {
  const { getValue, deps } = node.sweet.placeholder
  const update = () => {
    node.textContent = getValue(comp)
  }
  wire(comp, node, deps, update)
}

export default processTextNode
