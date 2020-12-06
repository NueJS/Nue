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
 * @param {Node} comment_node
 * @param {Array<string>} commentSplit
 */
function process_condition (comment_node, memo) {
  // const memo = this.memo.nodes[memo_id]
  const conditional = []
  const stateDeps = []

  const { path, fn_name, type, deps, call_fn } = memo
  console.log({ memo })
  let id = 0
  if (fn_name) {
    console.log('save fn-name', deps)
    conditional.push({ nodes: [], fn_name, comment_node, type, call_fn })
    stateDeps.push(...deps)
  }
  else {
    conditional.push({ nodes: [], path: memo.path, comment_node, type: 'if' })
    stateDeps.push(path)
  }

  let node = comment_node.nextSibling
  while (true) {
    process_node.call(this, node)

    // if condition node
    if (node.nodeName === Node.COMMENT_NODE) {
      const { path, type, fn_name, deps, args } = this.memo_of(node)

      if (type === 'else-if') {
        if (fn_name) {
          console.log('save fn-name')
          conditional.push({ nodes: [], fn_name, args, comment_node: node, type })
          stateDeps.push(...deps)
        }
        else {
          conditional.push({ nodes: [], path, comment_node: node, type })
          stateDeps.push(path)
        }
        id++
      }

      else if (type === 'else') {
        conditional.push({ nodes: [], comment_node: node, type })
        id++
      }

      else if (type === 'end-if') {
        break
      }
    }

    // if node inside condition
    else {
      conditional[id].nodes.push(node)
    }

    node = node.nextSibling
    if (node === null) throw new Error('missing end-if comment')
  }

  const on_conditions_change = () => {
    let trueFound = false
    conditional.forEach((group, i) => {
      const { fn_name, path, call_fn } = group
      let condition_value = true // else is true if all else fail

      if (fn_name) {
        condition_value = call_fn.call(this)
        console.log('value is ', condition_value)
      } else if (path) {
        condition_value = slice(this.$, path)
      }

      // if condition becomes truthy and another one before it is not truthy
      // then show this if not already
      if (condition_value && !trueFound) {
        trueFound = true
        if (group.isRemoved) {
          reverseForEach(group.nodes, (n) => {
            add(n, group.comment_node)
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

  // console.log({ stateDeps })
  const condition_deps = stateDeps.map(d => d.join('.'))

  on_conditions_change()
  this.on.beforeUpdate(on_conditions_change, condition_deps)
}

export default process_condition
