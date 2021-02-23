// function swapNodes (node1, node2) {
//   let type = 'before'
//   let anchor = node2.nextSibling
//   if (!anchor) {
//     anchor = node2.previousSibling
//     type = 'after'
//   }
//   node1.replaceWith(node2)
//   anchor[type](node1)
// }

import { createElement } from './dom'

function swapDom (a, b)
{
  a.reordering = true
  b.reordering = true

  const aParent = a.parentNode
  const bParent = b.parentNode

  const aHolder = createElement('div')
  const bHolder = createElement('div')

  aParent.replaceChild(aHolder, a)
  bParent.replaceChild(bHolder, b)

  aParent.replaceChild(b, aHolder)
  bParent.replaceChild(a, bHolder)

  a.reordering = false
  b.reordering = false
}

export default swapDom
