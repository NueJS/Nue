import DEV from '../../../dev/DEV'
import { arrayToHash } from '../../../others'
import checkUniquenessOfKeys from '../dev/checkUniquenessOfKeys'

/**
 * create new loopState using current array value
 * @param {import('../../../types').loopInfo} blob
 * @returns {import('../../../types').loopState}
 */
const getNewState = (blob) => {
  const { compNode, getArray, getKeys } = blob
  const values = getArray()
  const keys = getKeys()
  const keyHash = arrayToHash(keys)
  if (DEV) checkUniquenessOfKeys(compNode, keys)
  return {
    keys,
    values,
    keyHash
  }
}

export default getNewState
