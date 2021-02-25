import wire from '../connection/wire.js'

const processTextNode = (nue, node, parsed) => {
  const { getValue, deps } = parsed.placeholder
  const update = () => {
    node.textContent = getValue(nue)
  }
  wire(nue, node, deps, update)
}

export default processTextNode
