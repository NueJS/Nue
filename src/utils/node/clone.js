import copyParsed from './copyParsed'

const getClone = (node) => {
  const clone = node.cloneNode(true)
  copyParsed(node, clone)
  return clone
}

export default getClone
