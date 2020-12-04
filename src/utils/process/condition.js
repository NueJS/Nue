// import add_slice_dependency from '../reactivity/add_slice_dependency.js'
import { ignore_space, unwrap } from '../str.js'
import slice from '../slice/slice.js'
import process_node from './process_node.js'
import { add_node, remove_node } from '../tree/traverse.js'
import { reverseForEach } from '../others.js'

/**
 * process if, else-if, else-if, else conditional rendering
 * @param {Node} commentNode
 * @param {Array<string>} commentSplit
 */
function commentIf (commentNode, memo) {
  // console.log('found comment at', memo)
  const conditional = []
  const stateDeps = []
  let node = commentNode.nextSibling
  // const ifStateChain = unwrap(commentSplit[1]).split('.')
  let cIndex = 0
  conditional.push({ nodes: [], path: memo.path, commentNode, type: 'if' })
  stateDeps.push(memo.path)

  while (true) {
    if (node.nodeName === '#comment') {
      const textSplit = ignore_space(node.textContent)
      // console.log({ textSplit })
      if (textSplit[0] === 'else-if') {
        const path = unwrap(textSplit[1]).split('.')
        conditional.push({ nodes: [], path, commentNode: node, type: 'else-if' })
        stateDeps.push(path)
        cIndex++
      } else if (textSplit[0] === 'else') {
        conditional.push({ nodes: [], commentNode: node, type: 'else' })
        cIndex++
      } else if (textSplit[0] === 'end-if') {
        // console.log('break')
        break
      }
    } else {
      conditional[cIndex].nodes.push(node)
    }

    process_node.call(this, node)
    // console.log({ node })
    node = node.nextSibling
    if (node === null) {
      this.showError('missing end-if comment')
    }
  }

  const onConditionChange = () => {
    let trueFound = false
    conditional.forEach((group, i) => {
      const conditionValue = group.type !== 'else' ? slice(this.$, group.path) : true

      // console.log(conditionValue, this.$.count, group.path)
      // if condition becomes truthy and another one before it is not truthy
      // then show this if not already
      if (conditionValue && !trueFound) {
        trueFound = true
        if (group.isRemoved) {
          reverseForEach(group.nodes, (n) => {
            add_node(n, group.commentNode)
          })
          group.isRemoved = false
        }
      } else {
        if (!group.isRemoved) {
          group.nodes.forEach(n => remove_node(n))
          group.isRemoved = true
        }
      }
    })
  }

  const deps = stateDeps.map(d => d.join('.'))
  // console.log({ deps })
  onConditionChange()

  this.on.beforeUpdate(onConditionChange, deps)
}

export default commentIf
