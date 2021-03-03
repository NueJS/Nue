import { REORDERING } from '../constants'
import { createElement } from './dom'

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
const swapDom = (a, b) => {
  a[REORDERING] = true
  b[REORDERING] = true

  const aParent = a.parentNode
  const bParent = b.parentNode

  const aHolder = createElement('div')
  const bHolder = createElement('div')

  aParent.replaceChild(aHolder, a)
  bParent.replaceChild(bHolder, b)

  aParent.replaceChild(b, aHolder)
  bParent.replaceChild(a, bHolder)

  a[REORDERING] = false
  b[REORDERING] = false
}

export default swapDom
