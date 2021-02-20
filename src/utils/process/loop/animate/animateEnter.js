const animateEnter = ({ createdComps, enter }) => {
  if (!enter) return

  createdComps.forEach(comp => {
    comp.style.visibility = null
    comp.style.animation = enter
    comp.addEventListener('animationend', () => {
      comp.style.animation = null
    }, { once: true })
  })

  // clear array
  createdComps.length = 0
}

export default animateEnter
