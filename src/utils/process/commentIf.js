import onStateChange from '../reactivity/onStateChange.js'
import { uncurl } from '../str.js'
import getSlice from '../value.js'
import processNode from './processNode.js'
import { addTree, removeTree } from '../node/tree.js'
import { reverseForEach } from '../others.js'

/**
 * process if, else-if, else-if, else conditional rendering
 * @param {Node} commentNode
 * @param {Array<string>} commentSplit
 */
function commentIf (commentNode, commentSplit) {
  const conditional = []
  const stateDeps = []
  let node = commentNode.nextSibling
  const ifStateChain = uncurl(commentSplit[1]).split('.')
  let cIndex = 0
  conditional.push({ nodes: [], stateChain: ifStateChain, commentNode, type: 'if' })
  stateDeps.push(ifStateChain)

  while (true) {
    if (node.nodeName === '#comment') {
      const textSplit = node.textContent.trim().split(' ')
      if (textSplit[0] === 'else-if') {
        const stateChain = uncurl(textSplit[1]).split('.')
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
    if (node === null) {
      this.showError('missing end-if comment')
    }
  }

  const onConditionChange = () => {
    let trueFound = false
    conditional.forEach((group, i) => {
      const conditionValue = group.type !== 'else' ? getSlice(this.$, group.stateChain) : true

      // if condition becomes truthy and another one before it is not truthy
      // then show this if not already
      if (conditionValue && !trueFound) {
        trueFound = true
        if (group.isRemoved) {
          reverseForEach(group.nodes, (n) => {
            addTree(n, group.commentNode)
          })
          group.isRemoved = false
        }
      } else {
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
