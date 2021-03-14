import { flushArray } from '../others'
import parseNode from './parseNode'

/**
 * parse template element
 * @param {HTMLTemplateElement} templateElement
 * @param {Record<string, string>} childCompNodeNames
 */
const parseTemplate = (templateElement, childCompNodeNames) => {
  /** @type {Array<Function>} */
  const deferred = []
  parseNode(templateElement.content, childCompNodeNames, deferred)
  flushArray(deferred)
}

export default parseTemplate
