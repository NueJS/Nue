import { animate } from '../../../node/dom'

const animateRemove = (blob) => {
  const { exit, removedComps } = blob

  return new Promise(resolve => {
    // go to next animation
    const next = () => resolve(blob)

    // if no exit animation or no components, skip this
    if (!exit || !removedComps.length) next()
    else {
      removedComps.forEach((comp) => {
        // run exit animation for each removed components
        animate(comp, exit, true, () => {
          // @todo use animatedRemove instead ?
          comp.remove()
          next()
        })
      })

      removedComps.length = 0
    }
  })
}

export default animateRemove
