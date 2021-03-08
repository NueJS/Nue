import parseAttributes from './parseAttributes'
import parseTextNode from './parseTextNode'
import parseComp from './parseComp'

const parseNode = (node, childCompNodeNames, deferred) => {
  // if node is component, get it's name else it will be undefined
  const compName = childCompNodeNames[node.nodeName]
  // #text
  if (node.nodeType === Node.TEXT_NODE) return parseTextNode(node, deferred)
  // component
  if (compName) parseComp(node, compName, deferred)
  // attributes on component or simple node
  if (node.hasAttribute) parseAttributes(node, compName)
  // child nodes of component or simple node
  if (node.hasChildNodes()) node.childNodes.forEach(childNode => parseNode(childNode, childCompNodeNames, deferred))
}

export default parseNode
