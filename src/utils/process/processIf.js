import { addDeps } from '../state/subscribe.js'
import copyParsed from '../node/copyParsed.js'
import processNode from './processNode.js'
import { animate, onAnimationEnd } from '../node/dom.js'
import getClone from '../node/clone.js'

function processIf (nue, ifNode, parsed) {
  const group = [ifNode]

  if (parsed.group) {
    parsed.group.forEach(node => {
      group.push(getClone(node))
    })
  }

  parsed.isProcessed = true

  const { groupDeps } = parsed
  const anchorNode = ifNode.previousSibling

  // group that is currently rendered
  let active

  const onGroupDepChange = () => {
    // if a group's condition is foundSatisfied, this becomes true
    let foundSatisfied = false

    group.forEach(conditionNode => {
      const { condition, isProcessed, isRendered, enter } = conditionNode.parsed
      const satisfied = condition ? condition.getValue(nue) : true

      // if this group should be rendered
      if (!foundSatisfied && satisfied) {
        foundSatisfied = true

        // if this group is not currently rendered on DOM
        if (!isRendered) {
          // if this nue is never processed before
          if (!isProcessed) {
            processNode(nue, conditionNode)
            conditionNode.parsed.isProcessed = true
          }

          // if another group is active and has exit animation, wait for that animation to end, and then add
          // else directly add

          const mount = () => {
            anchorNode.after(conditionNode)
            if (enter) animate(conditionNode, enter)
          }
          if (
            active &&
            active.parsed.exit &&
            conditionNode !== active) {
            onAnimationEnd(active, mount)
            // active.onRemove(() => mountGroup(group))
          } else {
            mount()
            // mountGroup(group)
          }

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

  addDeps(nue, groupDeps, onGroupDepChange, 'stateReady')

  nue.deferred.push(() => {
    ifNode.remove()
    onGroupDepChange()
  })
}

export default processIf
