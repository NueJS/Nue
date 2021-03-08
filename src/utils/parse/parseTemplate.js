import { flushArray } from '../others'
import parseNode from './parseNode'

const parseTemplate = (templateNode, childCompNodeNames) => {
  const deferred = []
  parseNode(templateNode.content, childCompNodeNames, deferred)
  flushArray(deferred)
}

export default parseTemplate
