import slice from '../../state/slice.js'
import { addGroup, removeGroup, processGroup } from './group.js'
import { FN, REACTIVE } from '../../constants.js'
import createGroups from './createGroups.js'
import satisfies from './comparison.js'
import addDep from '../../state/addDep.js'

function process_if (if_node) {
  // nodes inside conditional nodes are divided into groups
  const groups = []

  // combinations of deps of all the condition node's deps
  // when any of the conditions change, check for re-render
  const deps = []

  // node which will be used as anchor after which all the group nodes will be appended
  // @TODO improve this - use comment node
  const anchorNode = if_node.previousSibling

  createGroups.call(this, if_node, deps, groups, anchorNode)

  // group that is currently rendered
  let activeGroup

  const on_conditions_change = () => {
    // if a group's condition is truthy,
    // all other groups after it should not be rendered even if they are true
    let true_found = false

    // for each group check if it should be rendered or not based on new condition value
    groups.forEach((group) => {
      const { placeholder } = group
      let condition_value = true // default value for else group

      // compute condition value
      // if true is found already no need to check the value, assume its true
      if (!true_found && placeholder) {
        if (placeholder.type === FN) {
          condition_value = placeholder.getValue.call(this)
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

        // if group should be rendered, but is already rendered - no need to render it
        if (!group.added) {
          if (!group.processed) processGroup.call(this, group)

          if (activeGroup && activeGroup.animate && group !== activeGroup) {
            const lastIndex = activeGroup.nodes.length - 1
            activeGroup.nodes[lastIndex].addEventListener('animationend', () => addGroup(group, anchorNode), { once: true })
          } else {
            addGroup(group, anchorNode)
          }

          activeGroup = group
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
          lastNode.addEventListener('animationend', () => removeGroup(group), { once: true })
        } else {
          removeGroup(group)
        }
      }
    })
  }

  this.delayedProcesses.push(() => {
    groups.forEach(g => {
      g.conditionNode.remove()
      g.nodes.forEach(n => n.remove())
    })

    on_conditions_change()
  })

  deps.forEach(dep => {
    addDep.call(this, dep, on_conditions_change, 'stateReady')
  })
}

export default process_if
