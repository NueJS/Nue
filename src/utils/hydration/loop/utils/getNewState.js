import { arrayToHash } from '../../../others'
import { checkUniquenessOfKeys } from '../dev/checkUniquenessOfKeys'

/**
 * create new loopState using current array value
 * @param {import('types/loop').LoopInfo} loopInfo
 * @returns {import('types/reconcile').ReconcileState}
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
