import { executeAndClear } from '../others'
import parseNode from './parseNode'

const parseTemplate = (templateNode, childCompNodeNames, name) => {
  const deferred = []
  templateNode.content.childNodes.forEach(node => parseNode(node, childCompNodeNames, deferred, name))
  executeAndClear(deferred)
}

export default parseTemplate
