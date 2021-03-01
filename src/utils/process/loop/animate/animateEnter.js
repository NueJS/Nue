import { animate } from '../../../node/dom'

// add enter animation of createdComps
const animateEnter = ([{ createdComps, enter }]) => {
  if (!enter) return

  createdComps.forEach(comp => {
    comp.style.visibility = null
    animate(comp, enter, true)
  })

  createdComps.length = 0
}

export default animateEnter
