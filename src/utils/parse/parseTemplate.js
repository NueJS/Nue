import { executeAndClear } from '../others'
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
  executeAndClear(deferred)
  uselessNodes.forEach(n => n.remove())

  parseIf(ifNodes)
}

export default parseTemplate
