import errors from '../../../dev/errors'

const checkUniquenessOfKeys = (comp, keys) => {
  const isUniqueArray = (arr) => {
    const set = new Set(arr)
    return set.size === arr.length
  }

  if (!isUniqueArray(keys)) {
    throw errors.KEYS_ARE_NOT_UNIQUE(keys, comp, 1)
  }
}

export default checkUniquenessOfKeys
