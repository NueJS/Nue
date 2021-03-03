import errors from '../../../dev/errors'

const checkUniquenessOfKeys = (compNode, keys) => {
  const isUniqueArray = (arr) => {
    const set = new Set(arr)
    return set.size === arr.length
  }

  if (!isUniqueArray(keys)) {
    throw errors.KEYS_ARE_NOT_UNIQUE(compNode.name, keys)
  }
}

export default checkUniquenessOfKeys
