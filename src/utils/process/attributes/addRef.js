/**
 * add reference to element on compNode.refs
 * @param {import('../../types').compNode} compNode
 * @param {import('../../types').parsedElement} element
 * @param {import('../../types').attribute} param2
 */
const addRef = (compNode, element, [refName]) => {
  compNode.refs[refName] = element
}

export default addRef
