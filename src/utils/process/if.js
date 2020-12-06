import process_node from './node.js'

function process_if (if_node) {
  // [ { type: 'if', condition: ['is_even'], conditional: [] }, ...]
  const conditional = []
  const deps = []

  const collect_nodes = (parent_node) => {
    const memo = this.memo_of(parent_node)
    console.log({ memo_collection: memo })

    const c = {
      type: parent_node.nodeName,
      condition: memo ? memo.attributes[0].path : null,
      nodes: []
    }

    conditional.push(c)

    parent_node.childNodes.forEach(node => {
      if (node.nodeName === 'ELSIF' || node.nodeName === 'ELSE') {
        collect_nodes(node)
        if_node.after(node)
      }
      else {
        process_node.call(this, node)
        c.nodes.push(node)
        console.log({ node, id: node.memo_id, memo: this.memo_of(node) })
        const { path } = this.memo_of(node).attributes
        deps.push(path)
      }
    })
  }

  collect_nodes(if_node)
  console.log({ conditional })

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

  // console.log({ slice_deps })
  const condition_deps = slice_deps.map(d => d.join('.'))

  on_conditions_change()
  this.on.beforeUpdate(on_conditions_change, condition_deps)
}

export default process_if
