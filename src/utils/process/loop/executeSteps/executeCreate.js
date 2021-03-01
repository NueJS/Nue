import createComp from '../utils/createComp'

const executeCreate = (index, value, blob) => {
  const { comps, anchorNode, enter, initialized } = blob
  // create new comp
  const newComp = createComp(blob, value, index)

  // if the newComp should be the first one, add it after the anchorNode
  if (index === 0) anchorNode.after(newComp)
  // else add it after the index - 1 th node
  else comps[index - 1].after(newComp)

  // update comps array
  comps.splice(index, 0, newComp)

  // if it should have animated enter, hide it first
  if (enter && initialized) {
    newComp.style.visibility = 'hidden'
    blob.createdComps.push(newComp)
  }
}

export default executeCreate
