import executeCreate from './executeCreate.js'
import executeRemove from './executeRemove.js'
import executeSwap from './executeSwap.js'

// get the steps from reconcile and perform them in DOM
const executeSteps = (steps, blob) => {
  const { comps } = blob
  steps.remove.forEach(step => executeRemove(step, comps))
  steps.add.forEach(step => executeCreate(step, blob))
  steps.swap.forEach(step => executeSwap(step, comps))
}

export default executeSteps
