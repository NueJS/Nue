import { attr } from '../node/dom'

const parseComp = (name, node, _node) => {
  // child nodes (slot) of child component should not be sweetified and saved in array instead
  _node.innerHTML = ''
  const newNode = document.createElement(name + '-')
  _node.replaceWith(newNode)
  newNode.parsed = {
    isComp: true,
    name,
    childNodes: [...node.childNodes]
  }

  // copy attributes
  for (const attrName of node.getAttributeNames()) {
    const attributeValue = attr(node, attrName)
    newNode.setAttribute(attrName, attributeValue)
  }

  return newNode
}

export default parseComp
