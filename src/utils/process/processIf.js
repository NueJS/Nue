import { subscribeMultiple } from '../state/subscribe.js'
import processNode from './processNode.js'
import { animate, animatedRemove, onAnimationEnd } from '../node/dom.js'
import getClone from '../node/clone.js'
import { BEFORE_DOM_BATCH, DEFERRED_WORK, PARSED } from '../constants.js'

const processIf = (compNode, ifNode, parsed) => {
  // @todo shorten this
  const group = [ifNode]
  if (parsed.group) {
    parsed.group.forEach(node => {
      group.push(getClone(node))
    })
  }

  ifNode.isProcessed = true

  const { groupDeps } = parsed
  const anchorNode = ifNode.previousSibling

  // group that is currently rendered
  let active

  const onGroupDepChange = () => {
    // if a group's condition is foundSatisfied, this becomes true
    let foundSatisfied = false

    group.forEach(conditionNode => {
      const { isProcessed, isConnected } = conditionNode
      const { condition, enter, exit } = conditionNode[PARSED]
      const satisfied = condition ? condition.getValue(compNode) : true

      // if this component should be mounted
      if (!foundSatisfied && satisfied) {
        foundSatisfied = true

        // if this node is not mounted, already
        if (!isConnected) {
          // if this node is not processed
          if (!isProcessed) {
            processNode(compNode, conditionNode)
            conditionNode.isProcessed = true
          }

          const mount = () => {
            anchorNode.after(conditionNode)
            if (enter) animate(conditionNode, enter, true)
          }

          // if it should wait for active component's animation to end
          const waitForAnimationEnd = active && active[PARSED].exit && conditionNode !== active

          // wait if needed, else mount it right now
          waitForAnimationEnd ? onAnimationEnd(active, mount) : mount()

          active = conditionNode
        }
      }

      // if the group should be removed
      else if (isConnected) {
        if (exit) animatedRemove(conditionNode, exit)
        else conditionNode.remove()
      }
    })
  }

  // since this modifies the DOM, it should be done in dom batches
  subscribeMultiple(compNode, groupDeps, onGroupDepChange, BEFORE_DOM_BATCH)

  compNode[DEFERRED_WORK].push(() => {
    ifNode.remove()
    onGroupDepChange()
  })
}

export default processIf
