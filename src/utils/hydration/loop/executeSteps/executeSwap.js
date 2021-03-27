import { swap } from '../../../others'
import { createElement } from '../../../node/dom'

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

  const aParent = a.parentNode
  const bParent = b.parentNode

  const aHolder = createElement('div')
  const bHolder = createElement('div')

  // @ts-ignore
  aParent.replaceChild(aHolder, a)
  // @ts-ignore
  bParent.replaceChild(bHolder, b)

  // @ts-ignore
  aParent.replaceChild(b, aHolder)
  // @ts-ignore
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
