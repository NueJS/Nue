import { PREV_OFFSET } from '../../../constants'

/**
 * get the left and top offset
 * @param {HTMLElement} element
 * @returns
 */
export const getOffset = (element) => ({
  left: element.offsetLeft,
  top: element.offsetTop
})

/**
 * save offset on compNode
 * @param {import('../../../types').compNode} compNode
 */
export const saveOffset = (compNode) => {
  compNode[PREV_OFFSET] = getOffset(compNode)
}

/**
 * save offsets for all comps
 * @param {Array<number>} indexes
 * @param {Array<import('../../../types').compNode>} comps
 */
export const saveOffsets = (indexes, comps) => {
  for (const index of indexes) {
    const comp = comps[index]
    comp[PREV_OFFSET] = getOffset(comp)
  }
}
