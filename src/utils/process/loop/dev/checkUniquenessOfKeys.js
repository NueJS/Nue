import errors from '../../../dev/errors'

/**
 *
 * @param {Array<any>} arr
 * @returns {boolean}
 */
const isUniqueArray = (arr) => {
  const set = new Set(arr)
  return set.size === arr.length
}

/**
 *
 * @param {import('../../../types').compNode} compNode
 * @param {Array<string>} keys
 */
const checkUniquenessOfKeys = (compNode, keys) => {
  if (!isUniqueArray(keys)) {
    throw errors.KEYS_ARE_NOT_UNIQUE(compNode.name, keys)
  }
}

export default checkUniquenessOfKeys
