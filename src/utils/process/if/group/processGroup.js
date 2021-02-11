import processNode from '../../processNode'

export function processGroup (comp, group) {
  group.nodes.forEach(node => {
    if (node.parsed) node.parsed.isProcessed = false
    processNode(comp, node)
  })
  group.isProcessed = true
}

export default processGroup
