import createGroups from './group/createGroups.js'
import { addDeps } from '../../state/addDep.js'
import processGroup from './group/processGroup.js'
import addGroup from './group/addGroup.js'
import removeGroup from './group/removeGroup.js'

function processIf (comp, ifNode) {
  const groups = createGroups(comp, ifNode)

  // get deps from groups
  const groupDeps = []

  groups.forEach(group => {
    if (group.deps) groupDeps.push(group.deps)

    comp.deferred.push(() => {
      // add comment anchorNode
      ifNode.before(group.anchorNode)
      // remove all the nodes of group
      group.nodes.forEach(n => n.remove())
    })
  })

  // group that is currently rendered
  let prevRenderedGroup

  const groupDepChanged = () => {
    // if a group's condition is foundSatisfied, this becomes true
    let foundSatisfied = false

    groups.forEach((group) => {
      const { isSatisfied, isProcessed, isRendered } = group
      // if this group should be rendered
      if (!foundSatisfied && isSatisfied()) {
        foundSatisfied = true

        // if this group is not currently rendered on DOM
        if (!isRendered) {
          // if this group is never processed before
          if (!isProcessed) processGroup(comp, group)

          // if this group should wait for other group's animation to end
          if (
            prevRenderedGroup &&
            prevRenderedGroup.exit &&
            group !== prevRenderedGroup) {
            prevRenderedGroup.onRemove(() => addGroup(group))
          } else {
            addGroup(group)
          }

          prevRenderedGroup = group
        }
      }

      // if the group should be removed
      else if (group.isRendered) {
        removeGroup(group)
      }
    })
  }

  addDeps(comp, groupDeps, groupDepChanged, 'stateReady')

  comp.deferred.push(() => {
    ifNode.after(document.createComment(' / IF '))
    ifNode.remove()
    groupDepChanged()
  })
}

export default processIf
