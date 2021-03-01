import transitionNode from './transitionNode'

export const animateMove = ([blob, dirtyIndexes]) => {
  const { reorder, comps } = blob

  return new Promise(resolve => {
    const next = () => resolve([blob, dirtyIndexes])

    // move on to next animation if reorder is not to be animated
    if (!reorder) next()

    else {
      const movedIndexes = dirtyIndexes.filter(i => comps[i] && comps[i].prevOffset && comps[i].afterOffset)
      // if no moved components, move on to next animation
      if (!movedIndexes.length) return next()
      // else
      const lastIndex = movedIndexes.length - 1
      movedIndexes.forEach((i, idx) => {
        const comp = comps[i]
        const { prevOffset, afterOffset } = comp
        transitionNode(comp, prevOffset, afterOffset, reorder, () => {
          if (idx === lastIndex) next()
        })
      })
    }
  })
}

export default animateMove
