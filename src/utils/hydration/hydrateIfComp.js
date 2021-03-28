import { subscribeMultiple } from '../subscription/subscribe.js'
import { hydrate } from './hydrate.js'
import { animate, animatedRemove, onAnimationEnd } from '../node/dom.js'
import { getParsedClone } from '../node/clone.js'
import { batches } from '../../enums'

/**
 * add conditional rendering
 * @param {IfComp} ifComp
 * @param {Comp} parentComp
 */
export const hydrateIfComp = (ifComp, parentComp) => {
  const parsed = ifComp._parsedInfo

  /** @type {ConditionalComp[]} */
  const group = [ifComp]

  if (parsed._conditionGroup) {
    parsed._conditionGroup.forEach(node => {
      group.push(
        getParsedClone(node)
      )
    })
  }

  ifComp._isProcessed = true

  const { _conditionGroupStateDeps } = parsed

  const anchorNode = /** @type {Comment} */(ifComp.previousSibling)

  // group that is currently rendered
  /** @type {ConditionalComp} */
  let active

  /** @type {boolean} */
  let initialized

  const onGroupDepChange = () => {
    // if a group's condition is foundSatisfied, this becomes true
    let foundSatisfied = false

    group.forEach(conditionNode => {
      const { _isProcessed, isConnected } = conditionNode
      const {
        _conditionAttribute,
        _animationAttributes
      } = /** @type {IfComp | ElseIfComp}*/(conditionNode)._parsedInfo

      const { _enter, _exit } = _animationAttributes

      const satisfied = _conditionAttribute ? _conditionAttribute._getValue(parentComp) : true

      // if this component should be mounted
      if (!foundSatisfied && satisfied) {
        foundSatisfied = true

        // if this node is not mounted, already
        if (!isConnected) {
          // if this node is not processed
          if (!_isProcessed) {
            hydrate(conditionNode, parentComp)
            conditionNode._isProcessed = true
          }

          const mount = () => {
            anchorNode.after(conditionNode)
            if (_enter && initialized) animate(conditionNode, _enter, true)
          }

          // if it should wait for active component's animation to end
          const waitForAnimationEnd = active && active._parsedInfo._animationAttributes._exit && conditionNode !== active

          // wait if needed, else mount it right now
          waitForAnimationEnd ? onAnimationEnd(active, mount) : mount()

          active = conditionNode
        }
      }

      // if the group should be removed
      else if (isConnected) {
        if (_exit) animatedRemove(conditionNode, _exit)
        else conditionNode.remove()
      }
    })
  }

  // since this modifies the DOM, it should be done in dom batches
  subscribeMultiple(
    parentComp,
    _conditionGroupStateDeps,
    onGroupDepChange, batches._beforeDOM
  )

  parentComp._deferredWork.push(() => {
    ifComp.remove()
    onGroupDepChange()
    initialized = true
  })
}
