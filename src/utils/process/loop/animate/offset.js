import { PREV_OFFSET } from '../../../constants'

export const getOffset = (node) => ({
  left: node.offsetLeft,
  top: node.offsetTop
})

export const saveOffset = (node) => {
  node[PREV_OFFSET] = getOffset(node)
}

export const saveOffsets = (indexes, comps) => {
  indexes.forEach(index => {
    const comp = comps[index]
    if (comp) comp[PREV_OFFSET] = getOffset(comp)
  })
}
