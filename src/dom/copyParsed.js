/**
 * copy .parsed properties from node's tree to cloneNode's tree
 * cloneNode is clone of node but it does not have custom .parsed properties added in node's tree
 * @param {ParsedDOMElement} node
 * @param {ParsedDOMElement} cloneNode
 */

export const copyParsed = (node, cloneNode) => {
  if (node._parsedInfo) {
    cloneNode._parsedInfo = node._parsedInfo
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach((childNode, i) => {
      copyParsed(
        // @ts-expect-error
        childNode,
        cloneNode.childNodes[i])
    })
  }
}
