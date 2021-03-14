/**
 *
 * @param {import('../../types').compNode} parentCompNode
 * @param {import('../../types').compNode} compNode
 * @param {import('../../types').attribute} param2
 */
const addStaticState = (parentCompNode, compNode, [value, name]) => {
  compNode.$[name] = value
}

export default addStaticState
