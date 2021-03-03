import wire from '../connection/wire.js'

const processTextNode = (compNode, node, parsed) => {
  const { getValue, deps } = parsed.placeholder
  const update = () => {
    node.textContent = getValue(compNode)
  }
  wire(compNode, node, deps, update)
}

export default processTextNode
