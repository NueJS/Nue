import { swap } from '../../../others'
import { createElement } from '../../../dom/create'

// const swapNodes = (node1, node2) => {
//   let type = 'before'
//   let anchor = node2.nextSibling
//   if (!anchor) {
//     anchor = node2.previousSibling
//     type = 'after'
//   }
//   node1.replaceWith(node2)
//   anchor[type](node1)
// }

// @TODO update this with upper one

/**
 * swap component a and b
 * @param {LoopedComp} a
 * @param {LoopedComp} b
 */

// @TODO: shorten this
const swapLoopedComps = (a, b) => {
  a._moving = true
  b._moving = true

  const aParent = /** @type {HTMLElement}*/(a.parentNode)
  const bParent = /** @type {HTMLElement}*/(b.parentNode)

  const aHolder = createElement('div')
  const bHolder = createElement('div')

  aParent.replaceChild(aHolder, a)

  bParent.replaceChild(bHolder, b)

  aParent.replaceChild(b, aHolder)

  bParent.replaceChild(a, bHolder)

  a._moving = false
  b._moving = false
}

/**
 * swap ith and jth compNodes
 * @param {[number, number,]} step
 * @param {LoopedComp[]} loopedCompInstances
 */
export const executeSwap = (step, loopedCompInstances) => {
  const [i, j] = step
  swapLoopedComps(loopedCompInstances[i], loopedCompInstances[j])
  swap(loopedCompInstances, i, j)
}
