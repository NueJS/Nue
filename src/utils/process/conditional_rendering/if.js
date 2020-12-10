import slice from '../../slice/slice.js'
import process_node from '../node.js'
import { reverseForEach } from '../../others.js'
import add_node from '../../tree/add.js'
import remove_node from '../../tree/remove.js'
import { FN, REACTIVE } from '../../constants.js'
import create_groups from './create_groups.js'
import satisfies from './comparison.js'

function process_if (if_node) {
  // nodes that are to be conditionally rendered
  const groups = []
  // combinations of deps of all the condition node's deps
  // when any of the conditions change, check for re-render
  const deps = []
  // node which will be used as anchor after which all the group nodes will be appended
  const anchor_node = if_node.previousSibling

  create_groups.call(this, if_node, deps, groups, anchor_node)

  const on_conditions_change = () => {
    // debugger
    // console.log('condition changed')
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
      if (!true_found && satisfies(condition_value, group.compareWith)) { // ADD
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

  this.delayed_processes.push(() => {
    groups.forEach(g => {
      // console.log('remove conditional node : ', g.conditionNode.nodeName)
      g.conditionNode.remove()
      g.nodes.forEach(n => n.remove())
    })

    on_conditions_change()
  })

  // console.log({ deps })
  // WHY TF THIS IS NOT WORKING !!!
  this.on.beforeUpdate(on_conditions_change, ...deps)

  // THIS SHIT WORKS, BUT IT IS EXPENSIVE AS HELL !
  // this.on.reactiveUpdate(on_conditions_change, ...deps)
}

export default process_if
