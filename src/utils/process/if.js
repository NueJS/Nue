import slice from '../slice/slice.js'
import process_node from './node.js'
import { reverseForEach } from '../others.js'
import add_node from '../tree/add.js'
import remove_node from '../tree/remove.js'
import { FN, REACTIVE } from '../constants.js'

function process_if (if_node) {
  // nodes that are to be conditionally rendered
  const groups = []
  // array of strings, combination of all the state deps used in conditions
  let deps = []

  // previous node of if_node, after which all the nodes will be added
  const anchor_node = if_node.previousSibling

  const collectNodes = (conditionNode) => {
    const memo = this.memo_of(conditionNode)
    // else node will not have memo
    if (memo) {
      const placeholder = memo.attributes[0].placeholder
      if (placeholder.type === FN) {
        deps = [...deps, ...placeholder.deps]
      } else {
        deps.push(memo.attributes[0].name)
      }
    }

    const group = {
      type: conditionNode.nodeName,
      placeholder: memo ? memo.attributes[0].placeholder : null,
      nodes: [],
      added: false,
      processed: false,
      conditionNode
    }

    // must add first and then move on
    groups.push(group)

    conditionNode.childNodes.forEach(node => {
      if (node.nodeName === 'ELSIF' || node.nodeName === 'ELSE' || node.nodeName === 'IF') {
        collectNodes(node)
        if_node.after(node)
      }
      else {
        group.nodes.push(node)
        node.processed = true
      }
    })
  }

  collectNodes(if_node)
  groups.forEach(g => {
    g.conditionNode.remove()
    g.nodes.forEach(n => n.remove())
  })

  const on_conditions_change = () => {
    console.log('condition changed')
    // if a group's condition is truthy,
    // all other groups after it should not be rendered even if they are true
    let true_found = false

    // for each group check if it should be rendered or not based on new condition value
    groups.forEach((group, i) => {
      const { placeholder } = group
      let condition_value = true // default for else

      // if true is found already no need to check the value
      if (!true_found && placeholder) {
        if (placeholder.type === FN) {
          condition_value = placeholder.get_value()
        } else if (placeholder.type === REACTIVE) {
          condition_value = slice(this.$, placeholder.path)
        }
      }

      // if condition becomes truthy and another one before it is not truthy
      // then show this if not already
      if (!true_found && condition_value) { // ADD
        true_found = true

        if (!group.added) {
          group.added = true

          if (!group.processed) {
            group.processed = true
            group.nodes.forEach(n => {
              n.processed = false
              process_node.call(this, n)
            })
          }

          reverseForEach(group.nodes, (n) => add_node(n, anchor_node))
        }
      }

      else {
        if (group.added) {
          group.nodes.forEach(n => remove_node(n))
          group.added = false
        }
      }
    })
  }

  on_conditions_change()
  // why before update is not working here ?
  this.on.reactiveUpdate(on_conditions_change, deps)
}

export default process_if
