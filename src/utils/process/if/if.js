import { addGroup, processGroup } from './group.js'
import createGroups from './createGroups.js'
import { addDeps } from '../../state/addDep.js'

function processIf (comp, ifNode) {
  const { groups, groupDeps } = createGroups(comp, ifNode)

  // group that is currently rendered
  let prevRenderedGroup

  const groupDepChanged = () => {
    // if a group's condition is foundSatisfied, this becomes true
    let foundSatisfied = false

    groups.forEach((group) => {
      // if this group should be rendered
      if (!foundSatisfied && group.isSatisfied()) {
        foundSatisfied = true

        // if this group is never processed before, process it first
        if (!group.isProcessed) processGroup(comp, group)

        // if this group is not already rendered
        if (!group.isRendered) {
          // if group should wait for other group's animation end
          if (prevRenderedGroup && prevRenderedGroup.animate && group !== prevRenderedGroup) {
            prevRenderedGroup.onRemove(() => addGroup(group))
          } else {
            addGroup(group, groups.anchorNode)
          }

          prevRenderedGroup = group
        }
      }

      // if the group should be removed
      else if (group.isRendered) {
        group.disconnect()
        group.remove()
      }
    })
  }

  addDeps(comp, groupDeps, groupDepChanged, 'stateReady')

  comp.delayedProcesses.push(() => {
    ifNode.after(document.createComment(' / IF '))
    ifNode.remove()
    groupDepChanged()
  })
}

export default processIf
