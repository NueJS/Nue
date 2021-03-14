/**
 *
 * @param {number} index
 * @param {Array<import("../../../types").compNode>} comps
 */

const executeRemove = (index, comps) => {
  comps[index].remove()
  comps.splice(index, 1)
}

export default executeRemove
