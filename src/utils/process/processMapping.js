import { attr } from '../str.js'
import deepClone from '../deepClone.js'
import deepEqual from '../deepEqual.js'
import processNode from './processNode.js'
import onStateChange from '../state/onStateChange.js'
import getSlice from '../value.js'

function processMapping (template, context) {
  const each = attr(template, 'each')
  if (!each) return
  const chain = each.split('.')
  const as = attr.call(this, template, 'as')
  const at = attr.call(this, template, 'at', true)
  const key = attr.call(this, template, 'key', true)
  // keep track of added nodes -> { key1: [...nodes], key2: [...nodes] }
  const frags = {}

  // create new frag and process frag children nodes
  function createFrag (value, index) {
    const frag = template.content.cloneNode(true)
    const ctx = { ...context, [as]: value, [at]: index };
    [...frag.children].forEach(n => processNode.call(this, n, ctx))
    return frag
  }

  // key is a unique property of each child in array
  // if no unique property is given use the index
  const getFragKey = (index) => key === null ? index : getSlice(this.state, chain)[key]

  const saveFrag = (frag, fragKey) => {
    frags[fragKey] = [...frag.children]
  }

  const getArray = () => getSlice(this.state, chain)

  const array = getSlice(this.state, chain)
  array.forEach((value, index) => {
    const frag = createFrag.call(this, value, index)
    const fragKey = getFragKey(index)
    saveFrag(frag, fragKey)
    template.before(frag)
  })

  const prevArray = deepClone(array)

  function reBuildNodes () {
    const array = getArray()
    const maxLength = Math.max(array.length, prevArray.length)

    for (let i = 0; i < maxLength; i++) {
      const value = array[i]
      // if ith value mismatch
      if (!deepEqual(prevArray[i], value)) {
        const fragKey = getFragKey(i)

        // if prevArray was shorter and new value is added in array
        if (i > prevArray.length - 1) {
          // create new node and add it at the end
          const frag = createFrag.call(this, value, i)
          saveFrag(frag, fragKey)
          template.before(frag)
          prevArray.push(deepClone(value))
        } else {
          // if the value is changed at index i
          // change the frag nodes at index i
          const oldNodes = frags[fragKey]

          function updateNode (node) {
            // debugger
            if (node.mapArrayUsage) {
              node.mapArrayUsage.forEach(usage => {
                const ctx = { ...context, [as]: value, [at]: i }
                if (usage.type === 'text') {
                  const currentValue = node.textContent
                  const newValue = ctx[usage.key]
                  if (currentValue !== newValue) { node.textContent = newValue }
                }
                else if (usage.type === 'attribute') {
                  const currentValue = node.getAttribute(usage.name)
                  const newValue = ctx[usage.key]
                  if (currentValue !== newValue) { node.setAttribute(usage.name, newValue) }
                }
                else if (usage.type === 'state-attribute') {
                  const currentValue = node.getAttribute(usage.name)
                  const newValue = ctx[usage.key]
                  if (currentValue !== newValue) { node.state[usage.name] = newValue }
                }
              })
            }
            if (node.hasChildNodes) {
              [...node.childNodes].forEach(n => updateNode(n))
            }
          }

          oldNodes.forEach((oldNode) => {
            updateNode(oldNode)
          })

          prevArray[i] = deepClone(value)
        }
      }
    }
  }

  if (isStateKey) {
    const l1 = chain.length
    onStateChange.call(this, chain, (updatedChain) => {
      const l2 = updatedChain.length
      if (l2 > l1) {
        reBuildNodes.call(this)
      } else {
        //
        const additional = updatedChain.slice(l1 - 1)
      }
    })
  }
}

export default processMapping
