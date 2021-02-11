import createComp from '../utils/comp'

const executeCreate = (index, value, blob) => {
  const { name, forInfo, comps, anchorNode, comp } = blob

  // create new comp
  const newComp = createComp(comp, name, forInfo, value, index)

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
