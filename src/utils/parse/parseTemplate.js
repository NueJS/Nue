import parseIf from './parseIf'
import parseNode from './parseNode'

function parseTemplate (templateNode, component) {
  const parsingInfo = {
    uselessNodes: [],
    ifNodes: [],
    deferred: [],
    component
  }

  templateNode.content.childNodes.forEach(node => parseNode(node, parsingInfo))

  const { deferred, uselessNodes, ifNodes } = parsingInfo
  deferred.forEach(m => m())
  deferred.length = 0
  uselessNodes.forEach(n => n.remove())

  parseIf(ifNodes)
}

export default parseTemplate
