const animateEnter = ({ createdComps, forInfo }) => {
  if (!forInfo.enter) return

  createdComps.forEach(comp => {
    comp.style.visibility = null
    comp.style.animation = forInfo.enter
    comp.addEventListener('animationend', () => {
      comp.style.animation = null
    }, { once: true })
  })

  // clear array
  createdComps.length = 0
}

export default animateEnter
