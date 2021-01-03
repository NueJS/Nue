import swapNodes from '../../../node/swapNodes.js'
import { swap } from '../../../others.js'
import markAsMoved from '../dom/markAsMoved.js'
import executeCreate from './executeCreate.js'
import executeRemove from './executeRemove.js'

// get the steps from reconcile and perform them in DOM
const executeSteps = (steps, blob) => {
  const { comps, forInfo } = blob

  steps.forEach(step => {
    const { type, index, value, indexes } = step

    if (type === 'create') {
      executeCreate(index, value, blob)
      if (forInfo.reorder) markAsMoved(index + 1, comps)
    }

    else if (type === 'remove') {
      executeRemove(index, blob)
      if (forInfo.reorder) markAsMoved(index, comps)
    }

    if (type === 'swap') {
      const [i, j] = indexes
      swapNodes(comps[i], comps[j])
      swap(comps, i, j)
      comps[i].isMoved = true
      comps[j].isMoved = true
    }
  })
}

export default executeSteps
