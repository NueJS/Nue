import executeCreate from './executeCreate.js'
import executeRemove from './executeRemove.js'
import executeSwap from './executeSwap.js'

/**
 * get the steps from reconcile and perform them in DOM
 * @param {import('../../../types').steps} steps
 * @param {import('../../../types').loopInfo} loopInfo
 */
const executeSteps = (steps, loopInfo) => {
  const { comps } = loopInfo
  steps.remove.forEach(removeStep => executeRemove(removeStep, comps))
  steps.add.forEach(addStep => executeCreate(addStep, loopInfo))
  steps.swap.forEach(swapStep => executeSwap(swapStep, comps))
}

export default executeSteps
