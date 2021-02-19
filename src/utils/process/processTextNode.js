import wire from '../connection/wire.js'

function processTextNode (comp, node) {
  const { getValue, deps } = node.parsed.placeholder
  const update = () => {
    node.textContent = getValue(comp.$)
  }
  wire(comp, node, deps, update)
}

export default processTextNode
