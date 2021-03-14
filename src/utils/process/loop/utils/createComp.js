import { INIT_$ } from '../../../constants'
import getClone from '../../../node/clone'

// create a clone of loopedComp
// get the closure for this component using the value and index

/**
 *
 * @param {import('../../../types').loopInfo} loopInfo
 * @param {any} value
 * @param {number} index
 * @returns {import('../../../types').compNode}
 */
const createComp = (loopInfo, value, index) => {
  const { loopedComp, compNode, getClosure } = loopInfo
  /** @type {import('../../../types').compNode} */
  // @ts-ignore
  const newComp = getClone(loopedComp)
  newComp.closure = compNode
  newComp[INIT_$] = getClosure(value, index)
  return newComp
}

export default createComp
