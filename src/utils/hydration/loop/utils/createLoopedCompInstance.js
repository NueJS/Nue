import { getParsedClone } from '../../../node/clone'

/**
 * create an instance of loopedComp
 * @param {LoopInfo} loopInfo
 * @param {any} value
 * @param {number} index
 * @returns {LoopedComp}
 */

export const createLoopedCompInstance = (loopInfo, value, index) => {
  const { _loopedComp, _parentComp, _getClosure } = loopInfo

  const newComp = /** @type {LoopedComp} */(getParsedClone(_loopedComp))

  newComp.parent = _parentComp
  newComp._prop$ = _getClosure(value, index)

  return newComp
}
