import { getParsedClone } from '../../../node/clone'

/**
 * create an instance of loopedComp
 * @param {import('types/loop').LoopInfo} loopInfo
 * @param {any} value
 * @param {number} index
 * @returns {import('types/dom').LoopedComp}
 */
export const createLoopedCompInstance = (loopInfo, value, index) => {
  const { _loopedComp, _parentComp, _getClosure } = loopInfo
  /** @type {import('types/dom').LoopedComp} */
  const newComp = getParsedClone(_loopedComp)
  newComp.parent = _parentComp
  newComp._prop$ = _getClosure(value, index)
  return newComp
}
