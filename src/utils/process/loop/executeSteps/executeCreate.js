import { getOffset } from '../../../node/dom'
import createComp from '../utils/createComp'

const executeCreate = (index, value, blob) => {
  const { forInfo, comps, anchorNode } = blob

  // create new comp
  const newComp = createComp(blob, value, index)

  // if reorder animation is set, record the initial offset
  if (forInfo.reorder) {
    requestAnimationFrame(() => {
      newComp.prev = getOffset(newComp)
    })
  }

  // add to DOM
  if (index === 0) anchorNode.after(newComp)
  else comps[index - 1].after(newComp)

  // update comps array
  comps.splice(index, 0, newComp)

  // record it in created Comps
  blob.createdComps.push(newComp)

  // if it should be animated
  // hide it
  if (forInfo.enter) {
    newComp.style.visibility = 'hidden'
  }
}

export default executeCreate
