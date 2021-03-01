import { animate } from '../../../node/dom'

const animateRemove = ([blob, dirtyIndexes]) => {
  const { exit, removedComps } = blob

  return new Promise(resolve => {
    // go to next animation
    const next = () => resolve([blob, dirtyIndexes])

    // if no exit animation or no components, skip this
    if (!exit || !removedComps.length) next()
    else {
      const lastIndex = removedComps.length - 1

      removedComps.forEach((comp, i) => {
        comp.style.display = null
        animate(comp, exit, true, () => {
          comp.remove()
          if (i === lastIndex) next()
        })
      })

      removedComps.length = 0
    }
  })
}

export default animateRemove
