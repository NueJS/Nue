import { animate } from '../../../node/dom'

const animateRemove = (blob) => {
  const { exit, removedComps } = blob

  return new Promise(resolve => {
    // go to next animation
    const next = () => resolve(blob)

    // if no exit animation or no components, skip this
    if (!exit || !removedComps.length) next()
    else {
      const lastIndex = removedComps.length - 1
      removedComps.forEach((comp, i) => {
        // run exit animation for each removed components
        animate(comp, exit, true, () => {
          // @todo use animatedRemove instead ?
          if (i === lastIndex) next()
          comp.remove()
        })
      })

      removedComps.length = 0
    }
  })
}

export default animateRemove
