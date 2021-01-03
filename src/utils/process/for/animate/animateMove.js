import { getOffset } from '../../../node/dom'

const animateCompMove = (node, oldBox, newBox, reorder, transitionEnded) => {
  // @TODO throw here instead
  if (!oldBox) return
  const deltaX = oldBox.left - newBox.left
  const deltaY = oldBox.top - newBox.top

  if (!(deltaX || deltaY)) return false

  // @TODO - don't add event listener if promise is resolved
  node.addEventListener('transitionend', transitionEnded, { once: true })
  // cancel new position before paint using css
  // after the new position are set, trigger animation to new position
  requestAnimationFrame(() => {
    node.style.transition = null
    node.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    requestAnimationFrame(() => {
      node.style.transform = null
      node.style.transition = `transform ${reorder}`
    })
  })

  return true
}

export const animateMove = (blob) => {
  const { forInfo, comps } = blob
  const { reorder } = forInfo

  const movedComps = comps.filter(c => c.isMoved)

  return new Promise(resolve => {
    const next = () => resolve(blob)
    if (!reorder) next()
    else {
      let compWillMove = false

      movedComps.forEach((c, i) => {
        const added = animateCompMove(c, c.prev, getOffset(c), reorder, next)
        if (added) compWillMove = true
      })

      // reset marks
      comps.forEach(c => { c.isMoved = false })

      if (!compWillMove) next()
    }
  })
}

export default animateMove
