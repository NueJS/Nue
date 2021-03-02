const executeRemove = (index, comps) => {
  comps[index].remove()
  comps.splice(index, 1)
}

export default executeRemove
