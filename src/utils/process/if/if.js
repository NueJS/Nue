import createGroups from './group/createGroups.js'
import { addDeps } from '../../state/addDep.js'
import processGroup from './group/processGroup.js'
import mountGroup from './group/mountGroup.js'
import unmountGroup from './group/unmountGroup.js'
import copyParsed from '../../node/copyParsed.js'
import processNode from '../processNode.js'

function processIf (comp, ifNode) {
  const group = [ifNode]

  if (ifNode.parsed.group) {
    ifNode.parsed.group.forEach(node => {
      const clone = node.cloneNode(true)
      copyParsed(node, clone)
      group.push(clone)
    })
  }

  ifNode.parsed.isProcessed = true

  const { groupDeps } = ifNode.parsed
  const anchorNode = ifNode.previousSibling

  // group that is currently rendered
  let active

  const onGroupDepChange = () => {
    // if a group's condition is foundSatisfied, this becomes true
    let foundSatisfied = false

    group.forEach(conditionNode => {
      const { condition, isProcessed, isRendered } = conditionNode.parsed
      const satisfied = condition ? condition.getValue(comp) : true

      // if this group should be rendered
      if (!foundSatisfied && satisfied) {
        foundSatisfied = true

        // if this group is not currently rendered on DOM
        if (!isRendered) {
          // if this comp is never processed before
          if (!isProcessed) {
            console.log('process : ', conditionNode)
            processNode(comp, conditionNode)
            conditionNode.parsed.isProcessed = true
          }

          // if this group should wait for other group's animation to end
          // if (
          //   active &&
          //   active.exit &&
          //   group !== active) {
          //   active.onRemove(() => mountGroup(group))
          // } else {
          //   mountGroup(group)
          // }

          if (!anchorNode) debugger
          anchorNode.after(conditionNode)
          conditionNode.parsed.isRendered = true
          active = conditionNode
        }
      }

      // if the group should be removed
      else if (isRendered) {
        conditionNode.remove()
        conditionNode.parsed.isRendered = false
      }
    })
  }

  addDeps(comp, groupDeps, onGroupDepChange, 'stateReady')

  comp.deferred.push(() => {
    ifNode.remove()
    onGroupDepChange()
  })
}

export default processIf
