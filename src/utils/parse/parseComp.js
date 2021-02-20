import { attr, createElement } from '../node/dom'
import dashify from '../string/dashify'

const parseComp = (name, node, _node) => {
  // child nodes (slot) of child component should not be sweetified and saved in array instead

  const newNode = createElement(name + '-')

  newNode.parsed = {
    isComp: true,
    name,
    childNodes: [...node.childNodes].filter(n => n.textContent.trim() !== ''),
    children: node.innerHTML,
    dashName: dashify(name)
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
