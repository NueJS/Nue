// function swapNodes (node1, node2) {
//   // console.log('swapping : ', node1, node2)
//   let type = 'before'
//   let anchor = node2.nextSibling
//   if (!anchor) {
//     anchor = node2.previousSibling
//     type = 'after'
//   }
//   node1.replaceWith(node2)
//   anchor[type](node1)
// }

function swapDom (a, b)
{
  // console.log('should turn off connection')
  a.ignoreConnectionChange = true
  b.ignoreConnectionChange = true

  const aParent = a.parentNode
  const bParent = b.parentNode

  const aHolder = document.createElement('div')
  const bHolder = document.createElement('div')

  aParent.replaceChild(aHolder, a)
  bParent.replaceChild(bHolder, b)

  aParent.replaceChild(b, aHolder)
  bParent.replaceChild(a, bHolder)

  // console.log('should turn on connection')

  a.ignoreConnectionChange = false
  b.ignoreConnectionChange = false
}

export default swapDom
