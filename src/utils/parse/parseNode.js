import parseAttributes from './parseAttributes'
import parseTextNode from './parseTextNode'
import parseComp from './parseComp'

/**
 *
 * @param {Node} node
 * @param {Record<string, string>} childCompNodeNames
 * @param {Array<Function>} deferred
 * @param {import('../types').compNode} compNode
 */
const parseNode = (node, childCompNodeNames, deferred, compNode) => {
  // if node is component, get it's name else it will be undefined
  const compName = childCompNodeNames[node.nodeName]

  // #text
  // @ts-ignore
  if (node.nodeType === Node.TEXT_NODE) return parseTextNode(node, deferred, compNode)

  // component
  // @ts-ignore
  if (compName) parseComp(node, compName, deferred)

  // attributes on component or simple node
  // @ts-ignore
  if (node.hasAttribute) parseAttributes(node, compName)

  // child nodes of component or simple node
  if (node.hasChildNodes()) node.childNodes.forEach(childNode => parseNode(childNode, childCompNodeNames, deferred, compNode))
}

export default parseNode
