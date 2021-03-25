import { animate } from '../../../node/dom'
import { createLoopedCompInstance } from '../utils/createLoopedCompInstance'

/**
 * create component instances using the give reconcileInfo
 * @param {[number, any]} reconcileInfo
 * @param {import('types/loop').LoopInfo} loopInfo
 */
export const executeCreate = (reconcileInfo, loopInfo) => {
  const [index, value] = reconcileInfo
  const { _loopedCompInstances, _anchor, _animation, _instanciated } = loopInfo

  // create newComp and add to DOM
  const newComp = createLoopedCompInstance(loopInfo, value, index)
  if (index === 0) _anchor.after(newComp)
  else _loopedCompInstances[index - 1].after(newComp)

  // update comps array
  _loopedCompInstances.splice(index, 0, newComp)

  // add enter animation if specified
  if (_animation._enter && _instanciated) animate(newComp, _animation._enter, true)
}
