const executeRemove = async (index, blob) => {
  const { comps, exit, removedComps } = blob

  // get the comp that is to be removed
  const removedComp = comps[index]

  // remove it from comps array
  comps.splice(index, 1)

  // if it should have animated exit, record it in removedComps
  if (exit) {
    removedComp.style.display = 'none'
    removedComps.push(removedComp)
  }
  // else remove it immediately
  else removedComp.remove()
}

export default executeRemove
