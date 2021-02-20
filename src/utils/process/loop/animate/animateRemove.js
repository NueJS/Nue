
const animateRemove = (blob) => {
  const { forInfo, removedComps } = blob
  const { exit } = forInfo

  return new Promise(resolve => {
    const next = () => resolve(blob)
    if (!exit || !removedComps.length) next()
    else {
      removedComps.forEach((comp, i) => {
        comp.style.animation = exit
        comp.addEventListener('animationend', () => {
          comp.style.animation = null
          comp.remove()
          next()
        }, { once: true })
      })

      removedComps.length = 0
    }
  })
}

export default animateRemove
