import swapDom from '../../../node/swapNodes'
import { swap } from '../../../others'

const executeSwap = (step, comps) => {
  const [i, j] = step
  swapDom(comps[i], comps[j])
  swap(comps, i, j)
}

export default executeSwap
