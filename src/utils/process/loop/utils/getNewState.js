import DEV from '../../../dev/DEV'
import { arrayToHash } from '../../../others'
import checkUniquenessOfKeys from '../dev/checkUniquenessOfKeys'

const getNewState = (blob) => {
  const { nue, getArray, getKeys } = blob
  const values = getArray()
  const keys = getKeys()
  const keyHash = arrayToHash(keys)
  if (DEV) checkUniquenessOfKeys(nue, keys)
  return {
    keys,
    values,
    keyHash
  }
}

export default getNewState
