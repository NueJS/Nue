/**
 * add Fn on compo
 * @param {import("../../types").compNode} compNode
 * @param {import("../../types").compNode} compNodeAgain
 * @param {import("../../types").attribute} param2
 */
const addFn = (compNode, compNodeAgain, [value, name]) => {
  // @ts-ignore
  compNode.fn[name] = compNode.closure.fn[value]
}

export default addFn
