import { CREATE, REMOVE, SWAP } from '../../../constants.js'
import swapNodes from '../../../node/swapNodes.js'
import { swap } from '../../../others.js'
// import markAsMoved from '../animate/markAsMoved.js'
import executeCreate from './executeCreate.js'
import executeRemove from './executeRemove.js'

// get the steps from reconcile and perform them in DOM
const executeSteps = (steps, blob) => {
  const { comps } = blob

  steps.forEach(step => {
    const { type, index, value, indexes } = step

    if (type === CREATE) executeCreate(index, value, blob)
    else if (type === REMOVE) executeRemove(index, blob)

    if (type === SWAP) {
      const [i, j] = indexes
      swapNodes(comps[i], comps[j])
      swap(comps, i, j)
    }
  })
}

export default executeSteps
