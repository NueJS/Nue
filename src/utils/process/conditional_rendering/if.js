import slice from '../../slice/slice.js'
import { add_group, remove_group, process_group } from './group.js'
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

  let active_group

  create_groups.call(this, if_node, deps, groups, anchor_node)

  // add nodes to dom
  // add enter attributes

  const on_conditions_change = () => {
    // debugger
    // if a group's condition is truthy,
    // all other groups after it should not be rendered even if they are true
    let true_found = false

    // for each group check if it should be rendered or not based on new condition value
    groups.forEach((group) => {
      const { placeholder } = group
      let condition_value = true // default for else

      // compute condition value
      // if true is found already no need to check the value, assume its true
      if (!true_found && placeholder) {
        if (placeholder.type === FN) {
          condition_value = placeholder.get_value()
        } else if (placeholder.type === REACTIVE) {
          condition_value = slice(this.$, placeholder.path)
        }
      }

      // show group
      // if previous active group is animating its exit, wait for it to complete
      // and then add the group
      // add enter attribute on node
      if (!true_found && satisfies(condition_value, group.compareWith)) { // ADD
        true_found = true

        if (!group.added) {
          if (!group.processed) process_group.call(this, group)

          if (active_group && active_group.animate && group !== active_group) {
            const lastIndex = active_group.nodes.length - 1
            active_group.nodes[lastIndex].addEventListener('animationend', () => add_group(group, anchor_node), { once: true })
          } else {
            add_group(group, anchor_node)
          }

          active_group = group
        }
      }

      // remove the group
      // if group should have animated exit
      // add exit attribute on all the nodes to start the animation
      // once the last animation completes, remove all the nodes
      else if (group.added) {
        if (group.animate) {
          group.nodes.forEach(node => node.setAttribute('exit', ''))
          const lastIndex = group.nodes.length - 1
          const lastNode = group.nodes[lastIndex]
          lastNode.addEventListener('animationend', () => remove_group(group), { once: true })
        } else {
          remove_group(group)
        }
      }
    })
  }

  this.delayed_processes.push(() => {
    groups.forEach(g => {
      g.conditionNode.remove()
      g.nodes.forEach(n => n.remove())
    })

    on_conditions_change()
  })

  this.on.beforeUpdate(on_conditions_change, ...deps)
}

export default process_if
