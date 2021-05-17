import { transit } from './transit'

/**
 * animateMove comps at indexes
 * @param {LoopedComp[]} loopedCompInstances
 * @param {Array<number>} indexes
 * @param {string} moveAnimation
 */

// @todo second arg should be comps instead of indexes
export const animateMove = (loopedCompInstances, indexes, moveAnimation) => {

  // debugger
  for (const index of indexes) {
    const comp = loopedCompInstances[index]

    // if (!comp) debugger
    if (comp && comp._prevOffset) {
      transit(comp, /** @type {Offset}  */(comp._prevOffset), /** @type {string}*/(moveAnimation))
    }
  }
}
