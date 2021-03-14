/**
 *
 * @param {import('../../types').compNode} compNode
 * @param {import('../../types').compNode} compNodeAgain
 * @param {import('../../types').attribute} param2
 */
const addStaticState = (compNode, compNodeAgain, [value, name]) => {
  compNode.$[name] = value
}

export default addStaticState
