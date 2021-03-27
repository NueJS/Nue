import { executeCreate } from './executeCreate.js'
import { executeRemove } from './executeRemove.js'
import { executeSwap } from './executeSwap.js'

/**
 * get the steps from reconcile and perform them in DOM
 * @param {ReconcileSteps} steps
 * @param {LoopInfo} loopInfo
 */
export const executeSteps = (steps, loopInfo) => {
  const { _remove, _add, _swap } = steps
  const { _loopedCompInstances } = loopInfo
  _remove.forEach(removeStep => executeRemove(removeStep, _loopedCompInstances))
  _add.forEach(addStep => executeCreate(addStep, loopInfo))
  _swap.forEach(swapStep => executeSwap(swapStep, _loopedCompInstances))
}
