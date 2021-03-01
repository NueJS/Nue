// transit node from one prevOffset to currentOffset
// call cb when the transition is complete

// offset is an object with left and top keys
// cssTransition is the transition information - minus the property
const transitionNode = (node, prevOffset, currentOffset, cssTransition, cb) => {
  const deltaX = prevOffset.left - currentOffset.left
  const deltaY = prevOffset.top - currentOffset.top

  node.addEventListener('transitionend', cb, { once: true })

  requestAnimationFrame(() => {
    // apply a "inverse" transform to place the node in prev position
    node.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    // remove transition so that transform applied above is not smoothly transitioned, it should be instant
    node.style.transition = null

    // for the next repaint
    requestAnimationFrame(() => {
      // remove the "inverse" transform to put the node back in current position
      node.style.transform = null
      // set transform transition to smoothly transit from old to new position
      node.style.transition = `transform ${cssTransition}`
    })
  })

  return true
}

export default transitionNode
