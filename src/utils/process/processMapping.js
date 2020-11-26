import { getUncurledAttribute } from '../str.js'
import deepClone from '../deepClone.js'
import deepEqual from '../deepEqual.js'
import processNode from './processNode.js'
import onStateChange from '../state/onStateChange.js'
import getValue from '../value.js'

function processMapping (templateNode, context) {
  const arrayKey = getUncurledAttribute(templateNode, 'each')

  if (arrayKey) {
    // get mapping attributes from template
    const as = getUncurledAttribute(templateNode, 'as')
    const at = getUncurledAttribute(templateNode, 'at')
    const key = getUncurledAttribute(templateNode, 'key')

    // keep track of added nodes
    // { key1: [...nodes], key2: [...nodes] }
    const frags = {}

    // keep copy of previous version of array
    let prevArray, fromState

    // create new frag and process frag children nodes
    function createFrag (value, index) {
      const frag = templateNode.content.cloneNode(true)
      const ctx = { ...context, [as]: value, [at]: index };
      [...frag.children].forEach(fragChild => processNode.call(this, fragChild, ctx))
      return frag
    }

    // key is a unique property of each child in array
    // if no unique property is given use the index
    const getFragKey = (index) => key === null ? index : this.state[arrayKey][key]

    const saveFrag = (frag, fragKey) => {
      frags[fragKey] = [...frag.children]
    }

    function buildNodes () {
      const [array, isStateKey] = getValue.call(this, arrayKey, context)
      fromState = isStateKey
      array.forEach((value, index) => {
        const frag = createFrag.call(this, value, index)
        const fragKey = getFragKey(index)
        saveFrag(frag, fragKey)
        templateNode.before(frag)
      })

      prevArray = deepClone(array)
    }

    function reBuildNodes () {
      const [array] = getValue.call(this, arrayKey, context)

      array.forEach((value, i) => {
        // if ith value mismatch
        if (!deepEqual(prevArray[i], value)) {
          const fragKey = getFragKey(i)

          // if prevArray was shorter and new value is added in array
          if (i > prevArray.length - 1) {
            // create new node and add it at the end
            const frag = createFrag.call(this, value, i)
            saveFrag(frag, fragKey)
            templateNode.before(frag)
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
                  // console.log({ context, usage, key: context[usage.key] })
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
      })
    }

    // build nodes and when the array is changed, re-build
    buildNodes.call(this)
    if (fromState) {
      onStateChange.call(this, arrayKey, () => {
        reBuildNodes.call(this)
      })
    }
  }
}

export default processMapping
