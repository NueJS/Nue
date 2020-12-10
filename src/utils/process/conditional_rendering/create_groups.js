import { FN } from '../../constants.js'

function create_groups (conditionNode, deps, groups, anchor_node) {
  const memo = this.memo_of(conditionNode)
  let compareWith
  // else node will not have memo

  if (memo) {
    const placeholder = memo.attributes[0].placeholder
    compareWith = memo.attributes[0].name
    if (placeholder.type === FN) {
      deps = [...deps, ...placeholder.deps]
    } else {
      deps.push(placeholder.content)
    }
  }

  const group = {
    type: conditionNode.nodeName,
    placeholder: memo ? memo.attributes[0].placeholder : null,
    nodes: [],
    added: false,
    processed: false,
    conditionNode,
    compareWith
  }

  // must add first and then move on
  groups.push(group)

  conditionNode.childNodes.forEach(node => {
    if (node.nodeName === 'ELSIF' || node.nodeName === 'ELSE' || node.nodeName === 'IF') {
      create_groups.call(this, node, deps, groups, anchor_node)
      this.delayed_processes.push(() => anchor_node.after(node))
    }
    else {
      group.nodes.push(node)
      node.processed = true
    }
  })
}

export default create_groups
