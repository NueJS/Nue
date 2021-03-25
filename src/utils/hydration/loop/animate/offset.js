
/**
 * get the left and top offset
 * @param {HTMLElement} element
 * @returns {import('types/others').Offset}
 */
export const getOffset = (element) => ({
  _left: element.offsetLeft,
  _top: element.offsetTop
})

/**
 * save offset on looped comp
 * @param {import('types/dom').LoopedComp} compNode
 */
export const saveOffset = (compNode) => {
  compNode._prevOffset = getOffset(compNode)
}

/**
 * save offsets for all loopedComponents
 * @param {number[]} indexes
 * @param {import('types/dom').LoopedComp[]} loopedComponents
 */
export const saveOffsets = (indexes, loopedComponents) => {
  for (const index of indexes) {
    const comp = loopedComponents[index]
    comp._prevOffset = getOffset(comp)
  }
}
