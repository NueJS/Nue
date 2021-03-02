import transitionNode from './transitionNode'

export const animateMove = (blob, dirtyIndexes) => {
  const { reorder, comps } = blob

  // @todo remove check for comps[i].prevOffset
  const movedIndexes = dirtyIndexes.filter(i => comps[i] && comps[i].prevOffset)

  movedIndexes.forEach(index => {
    const comp = comps[index]
    transitionNode(comp, comp.prevOffset, reorder)
  })
}

export default animateMove
