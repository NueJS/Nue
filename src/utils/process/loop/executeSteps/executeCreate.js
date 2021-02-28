import { saveOffset } from '../animate/offset'
import createComp from '../utils/createComp'

const executeCreate = (index, value, blob) => {
  const { reorder, comps, anchorNode, enter } = blob

  // create new comp
  const newComp = createComp(blob, value, index)

  // if reorder animation is set, record the initial offset
  if (reorder) {
    // why do it using rAF ?
    requestAnimationFrame(() => saveOffset(newComp))
  }

  // if the newComp should be the first one, add it after the anchorNode
  if (index === 0) anchorNode.after(newComp)
  // else add it after the index - 1 th node
  else comps[index - 1].after(newComp)

  // update comps array
  comps.splice(index, 0, newComp)

  // if it should have animated enter, hide it first
  if (enter) {
    newComp.style.visibility = 'hidden'
    // record it in created Comps
    blob.createdComps.push(newComp)
  }
}

export default executeCreate
