/**
 * add Fn on compo
 * @param {import("../../types").compNode} parentCompNode
 * @param {import("../../types").compNode} compNode
 * @param {import("../../types").attribute} param2
 */
const addFn = (parentCompNode, compNode, [value, name]) => {
  // @ts-ignore
  compNode.fn[name] = parentCompNode.closure.fn[value]
}

export default addFn
