// everything from index to end is marked as moved
// and record their offset as well if its gonna move
const markAsMoved = (index, comps) => {
  comps.forEach((comp, i) => {
    if (i >= index) {
      comp.isMoved = true
    }
  })
}

export default markAsMoved
