/**
 * add reference to element on compNode.refs
 * @param {import('../../types').compNode} compNode
 * @param {Element} element
 * @param {import('../../types').attribute} param2
 */
const addRef = (compNode, element, [refName]) => {
  compNode.refs[refName] = element
}

export default addRef
