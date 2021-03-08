import { executeAndClear } from '../others'
import parseNode from './parseNode'

const parseTemplate = (templateNode, childCompNodeNames, name) => {
  const deferred = []
  parseNode(templateNode.content, childCompNodeNames, deferred, name)
  executeAndClear(deferred)
}

export default parseTemplate
