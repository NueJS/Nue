import onStateChange from '../reactivity/onStateChange.js'
import { uncurl } from '../str.js'
import getSlice from '../value.js'
import processNode from './processNode.js'
import { addTree, removeTree } from '../node.js'

function reverseForEach (arr, cb) {
  for (let i = arr.length - 1; i >= 0; i--) {
    cb(arr[i], i)
  }
}

function commentIf (commentNode, commentSplit) {
  const conditional = []
  const stateDeps = []
  let node = commentNode.nextSibling
  const ifStateChain = uncurl(commentSplit[1]).split('.').slice(1)
  let cIndex = 0
  conditional.push({ nodes: [], stateChain: ifStateChain, commentNode, type: 'if' })
  stateDeps.push(ifStateChain)

  while (true) {
    if (node.nodeName === '#comment') {
      const textSplit = node.textContent.trim().split(' ')
      if (textSplit[0] === 'else-if') {
        const stateChain = uncurl(textSplit[1]).split('.').slice(1)
        conditional.push({ nodes: [], stateChain, commentNode: node, type: 'else-if' })
        stateDeps.push(stateChain)
        cIndex++
      } else if (textSplit[0] === 'else') {
        conditional.push({ nodes: [], commentNode: node, type: 'else' })
        cIndex++
      } else if (textSplit[0] === 'end-if') {
        break
      }
    } else {
      conditional[cIndex].nodes.push(node)
    }

    processNode.call(this, node)
    node = node.nextSibling
  }

  const onConditionChange = () => {
    let trueFound = false
    conditional.forEach((group, i) => {
      const conditionValue = group.type !== 'else' ? getSlice(this.state, group.stateChain) : true
      if (conditionValue && !trueFound) {
        trueFound = true
        if (group.isRemoved) {
          reverseForEach(group.nodes, (n) => {
            addTree(n, group.commentNode)
          })
          group.isRemoved = false
        }
      }
      else {
        if (!group.isRemoved) {
          group.nodes.forEach(n => removeTree(n))
          group.isRemoved = true
        }
      }
    })
  }

  onConditionChange()
  stateDeps.forEach(stateChain => {
    onStateChange.call(this, stateChain, onConditionChange)
  })
}

export default commentIf
