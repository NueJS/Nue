import { animate } from '../../../node/dom'

const animateEnter = ({ createdComps, enter }) => {
  if (!enter) return

  createdComps.forEach(comp => {
    comp.style.visibility = null
    // run enter animation for each created component
    animate(comp, enter, true)
  })

  // clear array
  createdComps.length = 0
}

export default animateEnter
