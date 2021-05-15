import { getOffset } from './offset'

/**
 * transit comp from one prevOffset to currentOffset with cssTransition
 * @param {LoopedComp} comp
 * @param {Offset} prevOffset
 * @param {string} cssTransition
 */
export const transit = (comp, prevOffset, cssTransition) => {
  const currentOffset = getOffset(comp)
  const deltaX = prevOffset._left - currentOffset._left
  const deltaY = prevOffset._top - currentOffset._top

  requestAnimationFrame(() => {
    // apply a "inverse" transform to place the comp in prev position
    comp.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    // remove transition so that transform applied above is not smoothly transitioned, it should be instant
    comp.style.transition = ''

    // for the next repaint
    requestAnimationFrame(() => {
      // remove the "inverse" transform to put the comp back in current position
      comp.style.transform = ''
      // set transform transition to smoothly transit from old to new position
      comp.style.transition = `transform ${cssTransition}`
    })
  })
}
