import { PREV_OFFSET } from '../../../constants'
import transitionNode from './transitionNode'

/**
 * animateMove comps at indexes
 * @param {import('../../../types').loopInfo} blob
 * @param {Array<number>} indexes
 */

// @todo second arg should be comps instead of indexes
export const animateMove = (blob, indexes) => {
  const { reorder, comps } = blob

  for (const index of indexes) {
    const comp = comps[index]
    transitionNode(comp, comp[PREV_OFFSET], reorder)
  }
}

export default animateMove
