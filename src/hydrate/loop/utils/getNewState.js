import { arrayToHash } from '../../../utils/array'
import { checkUniquenessOfKeys } from '../dev/checkUniquenessOfKeys'

/**
 * create new loopState using current array value
 * @param {LoopInfo} loopInfo
 * @returns {ReconcileState}
 */
export const getNewState = (loopInfo) => {
  const { _parentComp, _getArray, _getKeys } = loopInfo

  const keys = _getKeys()

  if (_DEV_) checkUniquenessOfKeys(keys, _parentComp)

  return {
    _keys: keys,
    _values: _getArray(),
    _keyHash: arrayToHash(keys)
  }
}
