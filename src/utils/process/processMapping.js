import { getUncurledAttribute } from '../str.js'
import deepClone from '../deepClone.js'
import deepEqual from '../deepEqual.js'
import processNode from './processNode.js'
import onStateChange from '../state/onStateChange.js'

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
    let prevArray

    // create new frag and process frag children nodes
    function createFrag (value, index) {
      const frag = templateNode.content.cloneNode(true)
      const context = { [as]: value, [at]: index };
      [...frag.children].forEach(fragChild => processNode.call(this, fragChild, context))
      return frag
    }

    // key is a unique property of each child in array
    // if no unique property is given use the index
    const getFragKey = (index) => key === null ? index : this.state[arrayKey][key]

    const saveFrag = (frag, fragKey) => {
      frags[fragKey] = [...frag.children]
    }

    function buildNodes () {
      const array = this.state[arrayKey]
      array.forEach((value, index) => {
        const frag = createFrag.call(this, value, index)
        const fragKey = getFragKey(index)
        saveFrag(frag, fragKey)
        templateNode.before(frag)
      })

      prevArray = deepClone(array)
    }

    function reBuildNodes () {
      const array = this.state[arrayKey]

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
            oldNodes.forEach((oldNode, j) => {
              // console.log(oldNode.mapArrayUsage)
              oldNode.mapArrayUsage.forEach(usage => {
                if (usage.type === 'text') {
                  const context = { [as]: value, [at]: i }
                  const currentValue = usage.node.textContent
                  const newValue = context[usage.key]
                  if (currentValue !== newValue) { usage.node.textContent = newValue }
                }
                if (usage.type === 'attribute') {
                  const context = { [as]: value, [at]: i }
                  const currentValue = oldNode.getAttribute(usage.name)
                  const newValue = context[usage.key]
                  if (currentValue !== newValue) { oldNode.setAttribute(usage.name, newValue) }
                }
              })
            })

            prevArray[i] = deepClone(value)
          }
        }
      })
    }

    // build nodes and when the array is changed, re-build
    buildNodes.call(this)
    onStateChange.call(this, arrayKey, () => {
      reBuildNodes.call(this)
    })
  }
}

export default processMapping
