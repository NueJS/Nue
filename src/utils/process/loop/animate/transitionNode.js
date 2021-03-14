import { getOffset } from './offset'

// transit node from one prevOffset to currentOffset
// call cb when the transition is complete

// offset is an object with left and top keys
// cssTransition is the transition information - minus the property

/**
 *
 * @param {HTMLElement} element
 * @param {{ left: number, top: number }} prevOffset
 * @param {string} cssTransition
 */
const transitionNode = (element, prevOffset, cssTransition) => {
  const currentOffset = getOffset(element)
  const deltaX = prevOffset.left - currentOffset.left
  const deltaY = prevOffset.top - currentOffset.top

  requestAnimationFrame(() => {
    // apply a "inverse" transform to place the element in prev position
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    // remove transition so that transform applied above is not smoothly transitioned, it should be instant
    element.style.transition = ''

    // for the next repaint
    requestAnimationFrame(() => {
      // remove the "inverse" transform to put the element back in current position
      element.style.transform = ''
      // set transform transition to smoothly transit from old to new position
      element.style.transition = `transform ${cssTransition}`
    })
  })
}

export default transitionNode
