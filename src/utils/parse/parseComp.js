import { attr } from '../node/dom'

const parseComp = (name, node, _node) => {
  // child nodes (slot) of child component should not be sweetified and saved in array instead

  const newNode = document.createElement(name + '-')

  newNode.parsed = {
    isComp: true,
    name,
    childNodes: [...node.childNodes].filter(n => n.textContent.trim() !== ''),
    children: node.innerHTML
  }

  newNode.innerHTML = _node.innerHTML
  _node.innerHTML = ''
  _node.replaceWith(newNode)

  // copy attributes
  for (const attrName of node.getAttributeNames()) {
    const attributeValue = attr(node, attrName)
    newNode.setAttribute(attrName, attributeValue)
  }

  return newNode
}

export default parseComp
