import swapDom from '../../../node/swapNodes'
import { swap } from '../../../others'

/**
 * swap ith and jth compNodes
 * @param {[number, number,]} step
 * @param {import('../../../types').compNode[]} comps
 */
const executeSwap = (step, comps) => {
  const [i, j] = step
  swapDom(comps[i], comps[j])
  swap(comps, i, j)
}

export default executeSwap
