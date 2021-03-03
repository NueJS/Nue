import { PREV_OFFSET } from '../../../constants'
import transitionNode from './transitionNode'

export const animateMove = (blob, dirtyIndexes) => {
  const { reorder, comps } = blob

  // @todo remove check for comps[i].prevOffset
  const movedIndexes = dirtyIndexes.filter(i => comps[i] && comps[i][PREV_OFFSET])

  movedIndexes.forEach(index => {
    const comp = comps[index]
    transitionNode(comp, comp[PREV_OFFSET], reorder)
  })
}

export default animateMove
