import { addDeps } from '../state/addDep.js'
import copyParsed from '../node/copyParsed.js'
import processNode from './processNode.js'
import { animate, onAnimationEnd } from '../node/dom.js'

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
      const { condition, isProcessed, isRendered, enter } = conditionNode.parsed
      const satisfied = condition ? condition.getValue(comp.$) : true

      // if this group should be rendered
      if (!foundSatisfied && satisfied) {
        foundSatisfied = true

        // if this group is not currently rendered on DOM
        if (!isRendered) {
          // if this comp is never processed before
          if (!isProcessed) {
            processNode(comp, conditionNode)
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

  addDeps(comp, groupDeps, onGroupDepChange, 'stateReady')

  comp.deferred.push(() => {
    ifNode.remove()
    onGroupDepChange()
  })
}

export default processIf
