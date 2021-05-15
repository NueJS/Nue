
/**
 * get the left and top offset
 * @param {LoopedComp} comp
 * @returns {Offset}
 */
export const getOffset = (comp) => ({
  _left: comp.offsetLeft,
  _top: comp.offsetTop
})

/**
 * save offset on looped comp
 * @param {LoopedComp} comp
 */
export const saveOffset = (comp) => {
  comp._prevOffset = getOffset(comp)
}

/**
 * save offsets for all loopedComponents
 * @param {number[]} indexes
 * @param {LoopedComp[]} loopedComponents
 */
export const saveOffsets = (indexes, loopedComponents) => {
  for (const index of indexes) {
    const comp = loopedComponents[index]
    comp._prevOffset = getOffset(comp)
  }
}
