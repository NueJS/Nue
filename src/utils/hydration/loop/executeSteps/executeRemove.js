/**
 * remove loopedComponent at given index in loopedCompInstances array
 * @param {number} index
 * @param {import("types/dom").LoopedComp[]} loopedCompInstances
 */

export const executeRemove = (index, loopedCompInstances) => {
  loopedCompInstances[index].remove()
  loopedCompInstances.splice(index, 1)
}
