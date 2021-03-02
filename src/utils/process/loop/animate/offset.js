export const getOffset = (node) => ({
  left: node.offsetLeft,
  top: node.offsetTop
})

export const saveOffset = (node) => {
  node.prevOffset = getOffset(node)
}

export const saveOffsets = (indexes, comps) => {
  indexes.forEach(index => {
    const comp = comps[index]
    if (comp) comp.prevOffset = getOffset(comp)
  })
}
