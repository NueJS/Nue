// import ignore_space from '../../string/ignore_space.js'

import slice from '../slice/slice.js'
// import ignore_space from '../string/ignore_space.js'
import traverse from '../tree/traverse.js'
import process_node from './node.js'

// maintain memo_id on clone and its childNodes
const memoClone = (node) => {
  const clone = node.cloneNode(true)
  clone.memo_id = node.memo_id
  let memo_id = node.memo_id
  traverse(clone, (node) => {
    node.memo_id = ++memo_id
  }, true)

  return clone
}

// this is just for array ?
// add for object as well
function process_map (commentNode, memo) {
  const { iterable, item, at, loopType } = memo
  const iterable_slice = slice(this.$, iterable)
  const nodes = []
  // console.group('map')

  // collect nodes inside the iteration
  let node = commentNode.nextSibling
  while (true) {
    // do not process nodes inside iteration
    // only their clones will be processed
    node.processed = true
    // if end-for reached, stop collecting nodes
    if (node.nodeName === Node.COMMENT_NODE && this.memo_of(node).type === 'end-for') break
    else nodes.push(node)
    node = node.nextSibling
    if (node === null) throw new Error('missing end-for')
  }

  // map data to nodes
  const map = (value, i) => {
    // console.log({ value, i })
    nodes.forEach(node => {
      const context = {
        [item]: value,
        [at]: i,
        path: [...iterable, i],
        indexKey: [at]
      }
      // clone the node and add memo_ids on child nodes
      const clone = memoClone(node)
      // process the cloned node
      process_node.call(this, clone, context)
      // add it
      commentNode.before(clone)
    })
  }

  // clone the nodes from nodes array, process them and add in it in components
  iterable_slice.forEach(map)

  // remove the original placeholder nodes
  nodes.forEach(node => node.remove())

  // console.groupEnd('map')
}

export default process_map

// import { attr } from '../str.js'
// import deepClone from '../deepClone.js'
// import deepEqual from '../deepEqual.js'
// import process_node from './process_node.js'
// import add_slice_dependency from '../reactivity/add_slice_dependency.js'
// import slice from '../slice.js'

// function processMapping (template, context) {
//   const each = attr(template, 'each')
//   if (!each) return
//   const chain = each.split('.')
//   const as = attr.call(this, template, 'as')
//   const at = attr.call(this, template, 'at', true)
//   const key = attr.call(this, template, 'key', true)
//   // keep track of added nodes -> { key1: [...nodes], key2: [...nodes] }
//   const frags = {}

//   // create new frag and process frag children nodes
//   function createFrag (value, index) {
//     const frag = template.content.cloneNode(true)
//     const ctx = { ...context, [as]: value, [at]: index };
//     [...frag.children].forEach(n => process_node.call(this, n, ctx))
//     return frag
//   }

//   // key is a unique property of each child in array
//   // if no unique property is given use the index
//   const getFragKey = (index) => key === null ? index : slice(this.$, chain)[key]

//   const saveFrag = (frag, fragKey) => {
//     frags[fragKey] = [...frag.children]
//   }

//   const getArray = () => slice(this.$, chain)

//   const array = slice(this.$, chain)
//   array.forEach((value, index) => {
//     const frag = createFrag.call(this, value, index)
//     const fragKey = getFragKey(index)
//     saveFrag(frag, fragKey)
//     template.before(frag)
//   })

//   const prevArray = deepClone(array)

//   function reBuildNodes () {
//     const array = getArray()
//     const maxLength = Math.max(array.length, prevArray.length)

//     for (let i = 0; i < maxLength; i++) {
//       const value = array[i]
//       // if ith value mismatch
//       if (!deepEqual(prevArray[i], value)) {
//         const fragKey = getFragKey(i)

//         // if prevArray was shorter and new value is added in array
//         if (i > prevArray.length - 1) {
//           // create new node and add it at the end
//           const frag = createFrag.call(this, value, i)
//           saveFrag(frag, fragKey)
//           template.before(frag)
//           prevArray.push(deepClone(value))
//         } else {
//           // if the value is changed at index i
//           // change the frag nodes at index i
//           const oldNodes = frags[fragKey]

//           function updateNode (node) {
//             // debugger
//             if (node.mapArrayUsage) {
//               node.mapArrayUsage.forEach(usage => {
//                 const ctx = { ...context, [as]: value, [at]: i }
//                 if (usage.type === 'text') {
//                   const currentValue = node.textContent
//                   const newValue = ctx[usage.key]
//                   if (currentValue !== newValue) { node.textContent = newValue }
//                 }
//                 else if (usage.type === 'attribute') {
//                   const currentValue = node.getAttribute(usage.name)
//                   const newValue = ctx[usage.key]
//                   if (currentValue !== newValue) { node.setAttribute(usage.name, newValue) }
//                 }
//                 else if (usage.type === '$-attribute') {
//                   const currentValue = node.getAttribute(usage.name)
//                   const newValue = ctx[usage.key]
//                   if (currentValue !== newValue) { node.$[usage.name] = newValue }
//                 }
//               })
//             }
//             if (node.hasChildNodes) {
//               [...node.childNodes].forEach(n => updateNode(n))
//             }
//           }

//           oldNodes.forEach((oldNode) => {
//             updateNode(oldNode)
//           })

//           prevArray[i] = deepClone(value)
//         }
//       }
//     }
//   }

//   if (isStateKey) {
//     const l1 = chain.length
//     add_slice_dependency.call(this, chain, (updatedChain) => {
//       const l2 = updatedChain.length
//       if (l2 > l1) {
//         reBuildNodes.call(this)
//       } else {
//         //
//         const additional = updatedChain.slice(l1 - 1)
//       }
//     })
//   }
// }

// export default processMapping
