import { syncNode } from '../subscription/node'

const processTextNode = (compNode, node, parsed) => {
  const { getValue, deps } = parsed.placeholder
  const update = () => {
    node.textContent = getValue(compNode)
  }
  syncNode(compNode, node, deps, update)
}

export default processTextNode
