// import add_slice_dependency from '../reactivity/add_slice_dependency.js'
import { unwrap } from '../string/placeholder.js'
import ignore_space from '../string/ignore_space.js'
import slice from '../slice/slice.js'
import process_node from './node.js'
import add from '../tree/add.js'
import remove from '../tree/remove.js'
import { reverseForEach } from '../others.js'

/**
 * process if, else-if, else-if, else conditional rendering
 * @param {Node} commentNode
 * @param {Array<string>} commentSplit
 */
function process_condition (commentNode, memo) {
  const conditional = []
  const stateDeps = []
  let node = commentNode.nextSibling
  let id = 0
  conditional.push({ nodes: [], path: memo.path, commentNode, type: 'if' })
  stateDeps.push(memo.path)

  while (true) {
    if (node.nodeName === '#comment') {
      const textSplit = ignore_space(node.textContent)
      if (textSplit[0] === 'else-if') {
        const path = unwrap(textSplit[1]).split('.')
        conditional.push({ nodes: [], path, commentNode: node, type: 'else-if' })
        stateDeps.push(path)
        id++
      } else if (textSplit[0] === 'else') {
        conditional.push({ nodes: [], commentNode: node, type: 'else' })
        id++
      } else if (textSplit[0] === 'end-if') {
        break
      }
    } else {
      conditional[id].nodes.push(node)
    }

    process_node.call(this, node)
    node = node.nextSibling
    if (node === null) {
      this.showError('missing end-if comment')
    }
  }

  const onConditionChange = () => {
    let trueFound = false
    conditional.forEach((group, i) => {
      const conditionValue = group.type !== 'else' ? slice(this.$, group.path) : true

      // if condition becomes truthy and another one before it is not truthy
      // then show this if not already
      if (conditionValue && !trueFound) {
        trueFound = true
        if (group.isRemoved) {
          reverseForEach(group.nodes, (n) => {
            add(n, group.commentNode)
          })
          group.isRemoved = false
        }
      }

      else {
        if (!group.isRemoved) {
          group.nodes.forEach(n => remove(n))
          group.isRemoved = true
        }
      }
    })
  }

  const deps = stateDeps.map(d => d.join('.'))
  onConditionChange()

  this.on.beforeUpdate(onConditionChange, deps)
}

export default process_condition
