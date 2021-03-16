import { flushArray } from '../others'
import parseNode from './parseNode'

/**
 * parse template element
 * @param {import('../types').compNode} compNode
 * @param {HTMLTemplateElement} templateElement
 * @param {Record<string, string>} childCompNodeNames
 */
const parseTemplate = (compNode, templateElement, childCompNodeNames) => {
  /** @type {Array<Function>} */
  const deferred = []
  parseNode(templateElement.content, childCompNodeNames, deferred, compNode)
  flushArray(deferred)
}

export default parseTemplate
