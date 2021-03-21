import { animate } from '../../../node/dom'
import createComp from '../utils/createComp'

/**
 *
 * @param {[number, any]} info
 * @param {import('../../../types').loopInfo} blob
 */
const executeCreate = (info, blob) => {
  const [index, value] = info
  const { comps, anchorNode, enter, initialized } = blob

  // create newComp and add to DOM
  const newComp = createComp(blob, value, index)
  if (index === 0) anchorNode.after(newComp)
  else comps[index - 1].after(newComp)

  // update comps array
  comps.splice(index, 0, newComp)

  // add enter animation if specified
  if (enter && initialized) animate(newComp, enter, true)
}

export default executeCreate
