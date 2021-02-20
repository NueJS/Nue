export const getOffset = (node) => ({
  left: node.offsetLeft,
  top: node.offsetTop
})

export const saveOffset = (node) => {
  node.prev = getOffset(node)
}

export const saveOffsets = (comps) => {
  comps.forEach(saveOffset)
}
