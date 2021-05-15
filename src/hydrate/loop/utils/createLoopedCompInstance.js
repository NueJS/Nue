import { getParsedClone } from '../../../dom/getParsedClone'

/**
 * create an instance of loopedComp
 * @param {LoopInfo} loopInfo
 * @param {any} value
 * @param {number} index
 * @returns {LoopedComp}
 */

export const createLoopedCompInstance = (loopInfo, value, index) => {
  const { _loopedComp, _parentComp, _getClosure } = loopInfo

  const loopedCompInstance = getParsedClone(_loopedComp)

  loopedCompInstance._isLooped = true
  loopedCompInstance.parent = _parentComp
  loopedCompInstance._prop$ = _getClosure(value, index)

  return loopedCompInstance
}
